import React, { useState, useEffect } from 'react';
import { fiiApi } from '../../services/fiiApi';

export default function FiiManager({ addToast }) {
  const [fiis, setFiis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [type, setType] = useState('PAPEL');
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchFiis = async () => {
    setLoading(true);
    try {
      const data = await fiiApi.listFiis();
      setFiis(data?.content || []);
    } catch (err) {
      console.error(err);
      addToast('Erro ao carregar lista de FIIs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiis();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    const upperCode = code.trim().toUpperCase();
    if (!/^[A-Z]{4}[0-9]{2}$/.test(upperCode)) {
      addToast('Código do FII inválido. Use o formato XXXX11 (Ex: MXRF11).', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await fiiApi.updateFii(editingId, upperCode, type);
        addToast(`FII ${upperCode} atualizado com sucesso!`, 'success');
      } else {
        await fiiApi.createFii(upperCode, type);
        addToast(`FII ${upperCode} cadastrado com sucesso!`, 'success');
      }
      setCode('');
      setType('PAPEL');
      setEditingId(null);
      fetchFiis();
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Erro ao salvar FII.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (fii) => {
    setEditingId(fii.id);
    setCode(fii.code);
    setType(fii.type);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setCode('');
    setType('PAPEL');
  };

  const handleDelete = async (id, codeStr) => {
    if (window.confirm(`Tem certeza que deseja remover o FII ${codeStr}? Isso também excluirá as transações e rendimentos vinculados a ele.`)) {
      try {
        await fiiApi.deleteFii(id);
        addToast(`FII ${codeStr} removido com sucesso!`, 'success');
        fetchFiis();
      } catch (err) {
        console.error(err);
        addToast('Erro ao excluir FII.', 'error');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Gestão de FIIs</h1>
          <p className="page-subtitle">Cadastre e gerencie os fundos imobiliários disponíveis para sua carteira</p>
        </div>
      </div>

      <div className="dashboard-grid form-list-grid">
        {/* Formulário */}
        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            {editingId ? 'Editar FII' : 'Cadastrar Novo FII'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="fii-code-input">Código do Ativo</label>
              <input
                id="fii-code-input"
                type="text"
                className="form-control"
                placeholder="Ex: MXRF11"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--txt-muted)', marginTop: '4px' }}>
                Deve conter 4 letras e 2 números.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="fii-type-select">Segmento / Tipo</label>
              <select
                id="fii-type-select"
                className="form-control"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="PAPEL">PAPEL (Recebíveis Imobiliários)</option>
                <option value="TIJOLO">TIJOLO (Escritórios / Shoppings / Renda)</option>
                <option value="LOGISTICA">LOGÍSTICA (Galpões Industriais)</option>
                <option value="AGRO">AGRO (Fiagro / Agronegócio)</option>
                <option value="VAREJO">VAREJO (Agências / Lojas de rua)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }} disabled={submitting}>
                {submitting ? 'Salvando...' : (editingId ? 'Salvar Alterações' : 'Cadastrar FII')}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista */}
        <div className="glass-card scrollable-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Ativos Cadastrados</h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando ativos...</div>
          ) : fiis.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--txt-secondary)' }}>
              Nenhum fundo imobiliário cadastrado ainda. Use o formulário ao lado para cadastrar.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Segmento</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {fiis.map((fii) => (
                    <tr key={fii.id}>
                      <td style={{ fontWeight: 700, color: '#ffffff', fontSize: '1.05rem' }}>{fii.code}</td>
                      <td>
                        <span className={`badge badge-${fii.type.toLowerCase()}`}>{fii.type}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(fii)}>Editar</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(fii.id, fii.code)}>Excluir</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
