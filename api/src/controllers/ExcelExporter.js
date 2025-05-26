import ExcelJS from 'exceljs';
import alunoService from '../services/alunoService.js';
import cursoService from '../services/cursoService.js';

class ExcelExporter {
  constructor() {
    this.styles = {
      mainTitle: {
        font: { bold: true, size: 18, color: { argb: 'FF2A568F' } },
        alignment: { horizontal: 'center' }
      },
      sheetTitle: {
        font: { bold: true, size: 14, color: { argb: 'FF2A568F' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6EFF7' } }
      },
      groupHeader: {
        font: { bold: true, size: 12, color: { argb: 'FF2A568F' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F7FC' } }
      },
      columnHeader: {
        font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF5B9BD5' } },
        alignment: { horizontal: 'center', vertical: 'middle' },
        border: {
          top: { style: 'thin', color: { argb: 'FF5B9BD5' } },
          bottom: { style: 'thin', color: { argb: 'FF5B9BD5' } },
          left: { style: 'thin', color: { argb: 'FF5B9BD5' } },
          right: { style: 'thin', color: { argb: 'FF5B9BD5' } }
        }
      },
      dataCell: {
        font: { size: 11 },
        border: {
          bottom: { style: 'hair', color: { argb: 'FFD9D9D9' } },
          left: { style: 'hair', color: { argb: 'FFD9D9D9' } },
          right: { style: 'hair', color: { argb: 'FFD9D9D9' } }
        }
      },
      classified: {
        font: { color: { argb: 'FF70AD47' }, bold: true }
      },
      reserve: {
        font: { color: { argb: 'FFFF0000' }, italic: true }
      },
      highlightRow: {
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F8F8' } }
      }
    };
  }

  async exportAlunos(res) {
    try {
      // 1. Obter dados
      const [alunos, cursos] = await Promise.all([
        alunoService.Listar(),
        cursoService.Listar().catch(() => []) // Degrada graciosamente
      ]);

      // 2. Preparar workbook
      const workbook = this.createWorkbook();
      const cursoGroups = this.groupAlunosByCurso(alunos, cursos);

      // 3. Criar planilha para cada curso
      for (const [cursoSigla, alunosCurso] of Object.entries(cursoGroups)) {
        const cursoNome = this.getCursoNome(cursoSigla, cursos);
        const worksheet = workbook.addWorksheet(this.sanitizeSheetName(cursoSigla));
        
        this.addCourseHeader(worksheet, cursoNome);
        this.addDataTable(worksheet, alunosCurso);
        this.finalizeWorksheet(worksheet);
      }

      // 4. Enviar arquivo
      await this.sendWorkbook(workbook, res, 'classificacao_alunos');
      
    } catch (error) {
      this.handleExportError(res, error);
    }
  }

  // ========== MÉTODOS AUXILIARES ========== //

  createWorkbook() {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Sistema Acadêmico';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.properties.date1904 = false;
    return workbook;
  }

  groupAlunosByCurso(alunos, cursos) {
    return alunos.reduce((groups, aluno) => {
      const cursoSigla = aluno.curso || 'GERAL';
      if (!groups[cursoSigla]) groups[cursoSigla] = [];
      groups[cursoSigla].push(aluno);
      return groups;
    }, {});
  }

  getCursoNome(sigla, cursos) {
    const curso = cursos.find(c => 
      (c.sigla || '').trim().toLowerCase() === (sigla || '').trim().toLowerCase()
    );
    return curso ? curso.nome : sigla;
  }

  sanitizeSheetName(name) {
    return name.substring(0, 31).replace(/[\\/*?:[\]]/g, '');
  }

  addCourseHeader(worksheet, cursoNome) {
    // Título principal
    worksheet.mergeCells('A1:F1');
    const titleRow = worksheet.getCell('A1');
    titleRow.value = `CLASSIFICAÇÃO - ${cursoNome.toUpperCase()}`;
    Object.assign(titleRow, this.styles.mainTitle);

    // Subtítulo com data
    worksheet.mergeCells('A2:F2');
    const dateRow = worksheet.getCell('A2');
    dateRow.value = `Gerado em: ${new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`;
    dateRow.font = { italic: true, size: 9, color: { argb: 'FF7F7F7F' } };
    dateRow.alignment = { horizontal: 'right' };

    // Espaçamento
    worksheet.addRow([]);
  }

  addDataTable(worksheet, alunos) {
    // Agrupar por cota
    const gruposCota = alunos.reduce((groups, aluno) => {
      const cota = aluno.cota || 'GERAL';
      if (!groups[cota]) groups[cota] = [];
      groups[cota].push(aluno);
      return groups;
    }, {});

    // Adicionar cada grupo de cota
    Object.entries(gruposCota).forEach(([cota, alunosCota]) => {
      this.addCotaGroup(worksheet, cota, alunosCota);
    });
  }

  addCotaGroup(worksheet, cota, alunos) {
    // Título do grupo
    const groupTitle = this.translateCota(cota);
    const groupRow = worksheet.addRow([groupTitle]);
    groupRow.height = 22;
    worksheet.mergeCells(`A${groupRow.number}:F${groupRow.number}`);
    groupRow.eachCell(cell => Object.assign(cell, this.styles.groupHeader));

    // Cabeçalhos das colunas
    const headers = [
      { header: 'Posição', key: 'posicao', width: 8 },
      { header: 'Média Final', key: 'media', width: 12 },
      { header: 'Estudante', key: 'nome', width: 40 },
      { header: 'Nascimento', key: 'nascimento', width: 14 },
      { header: 'Status', key: 'status', width: 18 },
      { header: 'CPF', key: 'cpf', width: 18 }
    ];

    const headerRow = worksheet.addRow(headers.map(h => h.header));
    headerRow.eachCell(cell => Object.assign(cell, this.styles.columnHeader));

    // Ordenar alunos por média (decrescente)
    alunos.sort((a, b) => b.media - a.media);

    // Adicionar dados
    alunos.forEach((aluno, index) => {
      const rowData = {
        posicao: index + 1,
        media: aluno.media,
        nome: aluno.nome ? aluno.nome.toUpperCase() : '-',
        nascimento: aluno.dataNascimento 
          ? new Date(aluno.dataNascimento).toLocaleDateString('pt-BR') 
          : '-',
        status: aluno.classificado ? 'CLASSIFICADO' : 'RESERVA',
        cpf: aluno.cpf || '-'
      };

      const row = worksheet.addRow(Object.values(rowData));
      
      // Formatação condicional
      row.eachCell((cell, colNumber) => {
        Object.assign(cell, this.styles.dataCell);
        
        // Linhas zebradas
        if (row.number % 2 === 0) {
          Object.assign(cell, this.styles.highlightRow);
        }

        // Formatação específica por coluna
        switch(colNumber) {
          case 1: // Posição
            cell.alignment = { horizontal: 'center' };
            break;
          case 2: // Média
            cell.numFmt = '0.000';
            cell.alignment = { horizontal: 'center' };
            break;
          case 4: // Nascimento
            cell.alignment = { horizontal: 'center' };
            break;
          case 5: // Status
            cell.alignment = { horizontal: 'center' };
            cell.value === 'CLASSIFICADO' 
              ? Object.assign(cell, this.styles.classified)
              : Object.assign(cell, this.styles.reserve);
            break;
          case 6: // CPF
            cell.alignment = { horizontal: 'center' };
            break;
        }
      });
    });

    // Espaço entre grupos
    worksheet.addRow([]);
  }

  translateCota(cota) {
    const translations = {
      'rede_publica_ampla': 'REDE PÚBLICA - AMPLA CONCORRÊNCIA',
      'rede_publica_territorio': 'REDE PÚBLICA - POR TERRITÓRIO',
      'rede_privada_ampla': 'REDE PRIVADA - AMPLA CONCORRÊNCIA',
      'rede_privada_territorio': 'REDE PRIVADA - POR TERRITÓRIO',
      'estudante_com_deficiencia': 'ESTUDANTES COM DEFICIÊNCIA',
      'GERAL': 'CLASSIFICAÇÃO GERAL'
    };
    return translations[cota] || cota.toUpperCase().replace(/_/g, ' ');
  }

  finalizeWorksheet(worksheet) {
    // Ajustar largura das colunas (fixo e proporcional)
    worksheet.getColumn(1).width = 8;   // Posição
    worksheet.getColumn(2).width = 12;  // Média Final
    worksheet.getColumn(3).width = 32;  // Estudante
    worksheet.getColumn(4).width = 14;  // Nascimento
    worksheet.getColumn(5).width = 18;  // Status
    worksheet.getColumn(6).width = 18;  // CPF

    // Adicionar filtros
    worksheet.autoFilter = {
      from: { row: 4, column: 1 },
      to: { row: 4, column: 6 }
    };

    // Congelar cabeçalhos
    worksheet.views = [
      { state: 'frozen', ySplit: 4 }
    ];

    // Proteger células (opcional)
    worksheet.protect('', {
      selectLockedCells: false,
      selectUnlockedCells: true
    });
  }

  async sendWorkbook(workbook, res, baseFilename) {
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `${baseFilename}_${timestamp}.xlsx`;
    
    res.setHeader('Content-Type', 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 
      `attachment; filename="${filename}"`);
    
    await workbook.xlsx.write(res);
    res.end();
  }

  handleExportError(res, error) {
    console.error('🚨 Erro na exportação:', error);
    
    res.status(500).json({ 
      success: false,
      error: 'Falha na geração do relatório',
      details: process.env.NODE_ENV === 'development' 
        ? error.message 
        : undefined
    });
  }
}

// Exportar instância pronta para uso
export default new ExcelExporter();