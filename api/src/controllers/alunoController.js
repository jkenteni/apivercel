import alunoService from '../services/alunoService.js';
import ExcelJS from 'exceljs';

export default {
  async Inserir(req, res) {
    try {
      const aluno = req.body;
      const resultado = await alunoService.Inserir(aluno);
      res.status(201).json(resultado);
    } catch (error) {
      console.error('Erro ao inserir aluno:', error);
      res.status(500).json({ erro: 'Erro ao inserir aluno' });
    }
  },

  async Listar(req, res) {
    try {
      const alunos = await alunoService.Listar();
      res.status(200).json(alunos);
    } catch (error) {
      console.error('Erro ao listar alunos:', error);
      res.status(500).json({ erro: 'Erro ao listar alunos' });
    }
  },

  async Editar(req, res) {
    try {
      const { id } = req.params;
      const dados = req.body;
      const resultado = await alunoService.Editar(id, dados);
      res.status(200).json(resultado);
    } catch (error) {
      console.error('Erro ao editar aluno:', error);
      res.status(500).json({ erro: 'Erro ao editar aluno' });
    }
  },

  async Excluir(req, res) {
    try {
      const { id } = req.params;
      const resultado = await alunoService.Excluir(id);
      res.status(200).json(resultado);
    } catch (error) {
      console.error('Erro ao excluir aluno:', error);
      res.status(500).json({ erro: 'Erro ao excluir aluno' });
    }
  },

  async Estatisticas(req, res) {
    try {
      const stats = await alunoService.Estatisticas();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao obter estatísticas' });
    }
  },

  async ExportarExcel(req, res) {
    try {
      const alunos = await alunoService.Listar();

      // Buscar cursos para nomes
      let cursos = [];
      try {
        const cursoRes = await import('../services/cursoService.js');
        cursos = await cursoRes.default.Listar();
      } catch {}

      // Função para pegar nome do curso pela sigla
      const getCursoNome = sigla => {
        const c = cursos.find(c => (c.sigla || '').trim().toLowerCase() === (sigla || '').trim().toLowerCase());
        return c ? c.nome : sigla;
      };

      // Função para pegar nome da cota formatado
      const getCotaNome = cota =>
        ({
          'rede_publica_ampla': 'REDE PÚBLICA - AMPLA CONCORRÊNCIA',
          'rede_publica_territorio': 'REDE PÚBLICA - TERRITÓRIO',
          'rede_privada_ampla': 'REDE PRIVADA - AMPLA CONCORRÊNCIA',
          'rede_privada_territorio': 'REDE PRIVADA - TERRITÓRIO',
          'estudante_com_deficiencia': 'ESTUDANTE COM DEFICIÊNCIA'
        }[cota] || cota.toUpperCase());

      const workbook = new ExcelJS.Workbook();

      // Estilos reutilizáveis
      const headerStyle = {
        font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5496' } },
        alignment: { horizontal: 'center', vertical: 'middle' },
        border: {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } }
        }
      };

      const dataRowStyle = {
        font: { size: 11 },
        border: {
          bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
          left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
          right: { style: 'thin', color: { argb: 'FFD9D9D9' } }
        }
      };

      const classifiedStyle = {
        font: { color: { argb: 'FF0070C0' }, bold: true }
      };

      const reserveStyle = {
        font: { color: { argb: 'FF000000' } }
      };

      // ===== Planilha por Curso (com todas as cotas juntas) =====
      const cursosUnicos = [...new Set(alunos.map(a => a.curso))];

      for (const sigla of cursosUnicos) {
        const alunosCurso = alunos.filter(a => a.curso === sigla);
        if (alunosCurso.length === 0) continue;

        const nomeCurso = getCursoNome(sigla);
        const ws = workbook.addWorksheet(sigla.substring(0, 31)); // Limita a 31 caracteres

        // Título do curso
        const titleRow = ws.addRow([`CURSO ${nomeCurso.toUpperCase()}`]);
        titleRow.font = { bold: true, size: 14, color: { argb: 'FF2F5496' } };
        titleRow.alignment = { horizontal: 'center' };
        ws.mergeCells(`A1:F1`);
        ws.addRow([]);

        // Agrupa por cota dentro do curso
        const cotasUnicas = [...new Set(alunosCurso.map(a => a.cota))];
        
        for (const cota of cotasUnicas) {
          const alunosCota = alunosCurso.filter(a => a.cota === cota);
          if (alunosCota.length === 0) continue;

          const nomeCota = getCotaNome(cota);
          
          // Subtítulo da cota
          const cotaRow = ws.addRow([nomeCota]);
          cotaRow.font = { bold: true, color: { argb: 'FF2F5496' } };
          cotaRow.alignment = { indent: 1 };
          ws.mergeCells(`A${ws.lastRow.number}:F${ws.lastRow.number}`);
          ws.addRow([]);

          // Cabeçalho da tabela
          const headerRow = ws.addRow([
            'Nº',
            'MÉDIA FINAL',
            'NOME DO(A) ESTUDANTE',
            'DATA NASCIMENTO',
            'SITUAÇÃO',
            'CPF'
          ]);
          
          headerRow.eachCell(cell => {
            Object.assign(cell, headerStyle);
          });

          // Ordena alunos por média (decrescente)
          alunosCota.sort((a, b) => b.media - a.media);

          // Adiciona linhas de dados
          alunosCota.forEach((aluno, index) => {
            const row = ws.addRow([
              index + 1,
              aluno.media,
              aluno.nome ? aluno.nome.toUpperCase() : '',
              aluno.dataNascimento ? new Date(aluno.dataNascimento).toLocaleDateString('pt-BR') : '',
              aluno.classificado ? 'CLASSIFICADO(A)' : 'CADASTRO RESERVA',
              aluno.cpf || ''
            ]);

            row.eachCell(cell => {
              Object.assign(cell, dataRowStyle);
              
              // Formatação específica por coluna
              switch(cell.col) {
                case 1: // Nº
                  cell.alignment = { horizontal: 'center' };
                  break;
                case 2: // MÉDIA FINAL
                  cell.numFmt = '0.000';
                  cell.alignment = { horizontal: 'center' };
                  break;
                case 4: // DATA NASCIMENTO
                  cell.alignment = { horizontal: 'center' };
                  break;
                case 5: // SITUAÇÃO
                  cell.alignment = { horizontal: 'center' };
                  if (cell.value === 'CLASSIFICADO(A)') {
                    Object.assign(cell, classifiedStyle);
                  } else {
                    Object.assign(cell, reserveStyle);
                  }
                  break;
                case 6: // CPF
                  cell.alignment = { horizontal: 'center' };
                  break;
              }
            });
          });

          // Espaço entre grupos de cota
          ws.addRow([]);
          ws.addRow([]);
        }

        // Ajusta largura das colunas
        ws.columns = [
          { width: 6 },  // Nº
          { width: 12 }, // MÉDIA FINAL
          { width: 40 }, // NOME
          { width: 16 }, // DATA NASC.
          { width: 20 }, // SITUAÇÃO
          { width: 18 }  // CPF
        ];

        // Congelar cabeçalhos
        ws.views = [
          { state: 'frozen', ySplit: 3 }
        ];
      }

      // ===== Finaliza e envia o arquivo =====
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=classificacao_alunos.xlsx');
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
      res.status(500).json({ erro: 'Erro ao exportar Excel' });
    }
  },
};