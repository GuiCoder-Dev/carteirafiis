import React, { useState, useEffect } from 'react';
import { fiiApi } from '../../services/fiiApi';
import { earningApi } from '../../services/earningApi';

export default function EarningsManager({ addToast, navigateToTab }) {
  const [earnings, setEarnings] = useState([]);
  const [fiis, setFiis] = useState([]);
  const [loading, setLoading] = useState(true);


  const [fiiId, setFiiId] = useState('');
  const [unitValuePayment, setUnitValuePayment] = useState('');
  const [paymentDate, setPaymentDate] = useState(() => new Date().toLocaleDateString('sv-SE'));
  const [submitting, setSubmitting] = useState(false);
  const [filterMonth, setFilterMonth] = useState('TODOS');
  const [filterYear, setFilterYear] = useState('TODOS');

  const fetchData = async () => {
    setLoading(true);
    try {
      const fiisData = await fiiApi.listFiis();
      const earnData = await earningApi.listEarnings();

      const loadedFiis = fiisData?.content || [];
      setFiis(loadedFiis);
      setEarnings(earnData?.content || []);

      if (loadedFiis.length > 0 && !fiiId) {
        setFiiId(loadedFiis[0].id.toString());
      }
    } catch (err) {
      console.error(err);
      addToast('Erro ao carregar dados de rendimentos.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fiiId) { addToast('Selecione um FII válido.', 'error'); return; }
    if (parseFloat(unitValuePayment) <= 0) {
      addToast('O valor pago por cota deve ser maior que zero.', 'error');
      return;
    }

    const today = new Date().toLocaleDateString('sv-SE');
    if (paymentDate > today) {
      addToast('A data de pagamento do provento não pode ser futura.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await earningApi.createEarning(fiiId, unitValuePayment, paymentDate);
      addToast('Rendimento cadastrado com sucesso!', 'success');
      setUnitValuePayment('');
      fetchData();
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Erro ao registrar rendimento.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Excluir este lançamento de provento? A posição consolidada da carteira será atualizada.')) {
      try {
        await earningApi.deleteEarning(id);
        addToast('Rendimento excluído com sucesso!', 'success');
        fetchData();
      } catch (err) {
        console.error(err);
        addToast('Erro ao excluir rendimento.', 'error');
      }
    }
  };

  const availableYears = Array.from(new Set(
    earnings.map(e => new Date(e.paymentDate).getUTCFullYear().toString())
  )).sort((a, b) => b.localeCompare(a));

  const filteredEarnings = earnings.filter(earn => {
    const earnDate = new Date(earn.paymentDate);
    const earnYear = earnDate.getUTCFullYear().toString();
    const earnMonth = (earnDate.getUTCMonth() + 1).toString();

    const matchesYear = filterYear === 'TODOS' || earnYear === filterYear;
    const matchesMonth = filterMonth === 'TODOS' || earnMonth === filterMonth;

    return matchesYear && matchesMonth;
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Histórico de Proventos</h1>
          <p className="page-subtitle">Acompanhe os dividendos e rendimentos pagos pelos fundos imobiliários da sua carteira</p>
        </div>
      </div>

      <div className="dashboard-grid form-list-grid">
        { }
        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Registrar Provento Recebido</h2>

          {fiis.length === 0 && !loading ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <p style={{ color: 'var(--txt-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Nenhum FII cadastrado para receber proventos.
              </p>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => navigateToTab('fiis')}>
                Cadastrar Primeiro FII
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="earn-fii-select">Fundo Imobiliário (FII)</label>
                <select
                  id="earn-fii-select"
                  className="form-control"
                  value={fiiId}
                  onChange={(e) => setFiiId(e.target.value)}
                  required
                >
                  {fiis.map(f => (
                    <option key={f.id} value={f.id}>{f.code} ({f.type})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="earn-value-input">Rendimento por Cota (R$)</label>
                <input
                  id="earn-value-input"
                  type="number"
                  className="form-control"
                  placeholder="Ex: 0.10"
                  step="0.0001"
                  min="0.0001"
                  value={unitValuePayment}
                  onChange={(e) => setUnitValuePayment(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="earn-date-input">Data do Pagamento</label>
                <input
                  id="earn-date-input"
                  type="date"
                  className="form-control"
                  max={new Date().toLocaleDateString('sv-SE')}
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  required
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--txt-muted)', marginTop: '4px' }}>
                  A quantidade de cotas considerada será a que você possuía nesta data de pagamento.
                </span>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1.5rem' }}
                disabled={submitting}
              >
                {submitting ? 'Registrando...' : 'Registrar Pagamento'}
              </button>
            </form>
          )}
        </div>

        { }
        <div className="glass-card scrollable-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Registro de Rendimentos</h2>

            { }
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <label htmlFor="filter-month" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--txt-secondary)' }}>Mês:</label>
                <select
                  id="filter-month"
                  className="form-control"
                  style={{ width: '130px', padding: '0.4rem 0.75rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                >
                  <option value="TODOS">Todos</option>
                  <option value="1">Janeiro</option>
                  <option value="2">Fevereiro</option>
                  <option value="3">Março</option>
                  <option value="4">Abril</option>
                  <option value="5">Maio</option>
                  <option value="6">Junho</option>
                  <option value="7">Julho</option>
                  <option value="8">Agosto</option>
                  <option value="9">Setembro</option>
                  <option value="10">Outubro</option>
                  <option value="11">Novembro</option>
                  <option value="12">Dezembro</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <label htmlFor="filter-year" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--txt-secondary)' }}>Ano:</label>
                <select
                  id="filter-year"
                  className="form-control"
                  style={{ width: '110px', padding: '0.4rem 0.75rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                >
                  <option value="TODOS">Todos</option>
                  {availableYears.map(yr => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando rendimentos...</div>
          ) : earnings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--txt-secondary)' }}>
              Nenhum rendimento cadastrado ainda. Lance um rendimento ao lado.
            </div>
          ) : filteredEarnings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--txt-secondary)' }}>
              Nenhum rendimento corresponde aos filtros selecionados.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Data Pagto</th>
                    <th>FII</th>
                    <th style={{ textAlign: 'right' }}>Cotas</th>
                    <th style={{ textAlign: 'right' }}>Val. Unitário</th>
                    <th style={{ textAlign: 'right' }}>Total Recebido</th>
                    <th style={{ textAlign: 'right' }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {[...filteredEarnings]
                    .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
                    .map((earn) => (
                      <tr key={earn.id}>
                        <td style={{ fontSize: '0.85rem', color: 'var(--txt-secondary)' }}>
                          {new Date(earn.paymentDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                        </td>
                        <td style={{ fontWeight: 700, color: '#ffffff' }}>{earn.fiiCode}</td>
                        <td style={{ textAlign: 'right' }}>{earn.quantity}</td>
                        <td style={{ textAlign: 'right', color: '#10b981' }}>
                          R$ {(earn.UnitValuePayment || earn.unitValuePayment || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                        </td>
                        <td style={{ textAlign: 'right', color: '#10b981', fontWeight: 600 }}>
                          R$ {(earn.TotalGain || earn.totalGain || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(earn.id)}>Excluir</button>
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
