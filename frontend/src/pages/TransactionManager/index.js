import React, { useState, useEffect } from 'react';
import { fiiApi } from '../../services/fiiApi';
import { transactionApi } from '../../services/transactionApi';

export default function TransactionManager({ addToast, navigateToTab }) {
  const [transactions, setTransactions] = useState([]);
  const [fiis, setFiis] = useState([]);
  const [loading, setLoading] = useState(true);


  const [fiiId, setFiiId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [date, setDate] = useState(() => new Date().toLocaleDateString('sv-SE'));
  const [type, setType] = useState('COMPRA');
  const [submitting, setSubmitting] = useState(false);
  const [filterMonth, setFilterMonth] = useState('TODOS');
  const [filterYear, setFilterYear] = useState('TODOS');

  const fetchData = async () => {
    setLoading(true);
    try {
      const fiisData = await fiiApi.listFiis();
      const txsData = await transactionApi.listTransactions();

      const loadedFiis = fiisData?.content || [];
      setFiis(loadedFiis);
      setTransactions(txsData?.content || []);

      if (loadedFiis.length > 0 && !fiiId) {
        setFiiId(loadedFiis[0].id.toString());
      }
    } catch (err) {
      console.error(err);
      addToast('Erro ao carregar dados de transações.', 'error');
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
    if (parseInt(quantity) <= 0 || parseFloat(unitPrice) <= 0) {
      addToast('Quantidade e Preço devem ser maiores que zero.', 'error');
      return;
    }

    const today = new Date().toLocaleDateString('sv-SE');
    if (date > today) {
      addToast('A data da transação não pode ser futura.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await transactionApi.createTransaction(fiiId, quantity, unitPrice, date, type);
      addToast(`Transação de ${type} registrada com sucesso!`, 'success');
      setQuantity('');
      setUnitPrice('');
      fetchData();
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Erro ao registrar transação.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Excluir esta transação? A posição consolidada da carteira será atualizada.')) {
      try {
        await transactionApi.deleteTransaction(id);
        addToast('Transação excluída com sucesso!', 'success');
        fetchData();
      } catch (err) {
        console.error(err);
        addToast('Erro ao excluir transação.', 'error');
      }
    }
  };

  const availableYears = Array.from(new Set(
    transactions.map(t => new Date(t.date).getUTCFullYear().toString())
  )).sort((a, b) => b.localeCompare(a));

  const filteredTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.date);
    const txYear = txDate.getUTCFullYear().toString();
    const txMonth = (txDate.getUTCMonth() + 1).toString();

    const matchesYear = filterYear === 'TODOS' || txYear === filterYear;
    const matchesMonth = filterMonth === 'TODOS' || txMonth === filterMonth;

    return matchesYear && matchesMonth;
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Histórico de Transações</h1>
          <p className="page-subtitle">Lance e acompanhe suas compras e vendas de cotas de fundos imobiliários</p>
        </div>
      </div>

      <div className="dashboard-grid form-list-grid">
        { }
        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Registrar Transação</h2>

          {fiis.length === 0 && !loading ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <p style={{ color: 'var(--txt-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Nenhum FII cadastrado para receber transações.
              </p>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => navigateToTab('fiis')}>
                Cadastrar Primeiro FII
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="tx-fii-select">Fundo Imobiliário (FII)</label>
                <select
                  id="tx-fii-select"
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
                <label className="form-label">Tipo de Operação</label>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '4px' }}>
                  <button
                    type="button"
                    className={`btn ${type === 'COMPRA' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flexGrow: 1, padding: '0.6rem' }}
                    onClick={() => setType('COMPRA')}
                  >
                    COMPRA
                  </button>
                  <button
                    type="button"
                    className={`btn ${type === 'VENDA' ? 'btn-danger' : 'btn-secondary'}`}
                    style={{
                      flexGrow: 1,
                      padding: '0.6rem',
                      background: type === 'VENDA' ? 'hsl(var(--color-danger))' : '',
                      color: type === 'VENDA' ? '#fff' : ''
                    }}
                    onClick={() => setType('VENDA')}
                  >
                    VENDA
                  </button>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="tx-qty-input">Quantidade (Cotas)</label>
                  <input
                    id="tx-qty-input"
                    type="number"
                    className="form-control"
                    placeholder="Ex: 10"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="tx-price-input">Preço Unitário (R$)</label>
                  <input
                    id="tx-price-input"
                    type="number"
                    className="form-control"
                    placeholder="Ex: 9.80"
                    step="0.01"
                    min="0.01"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tx-date-input">Data da Transação</label>
                <input
                  id="tx-date-input"
                  type="date"
                  className="form-control"
                  max={new Date().toLocaleDateString('sv-SE')}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1.25rem' }}
                disabled={submitting}
              >
                {submitting ? 'Registrando...' : 'Registrar Operação'}
              </button>
            </form>
          )}
        </div>

        { }
        <div className="glass-card scrollable-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Registro de Operações</h2>

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
            <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando histórico...</div>
          ) : transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--txt-secondary)' }}>
              Nenhuma transação cadastrada ainda. Utilize o formulário ao lado.
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--txt-secondary)' }}>
              Nenhuma transação corresponde aos filtros selecionados.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>FII</th>
                    <th>Operação</th>
                    <th style={{ textAlign: 'right' }}>Qtd</th>
                    <th style={{ textAlign: 'right' }}>Preço Unit.</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                    <th style={{ textAlign: 'right' }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {[...filteredTransactions]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((tx) => {
                      const fiiCode = tx.fiiCode || (fiis.find(f => f.id === tx.fii_id || f.id === tx.fiiId) || {}).code || '—';
                      return (
                        <tr key={tx.id}>
                          <td style={{ fontSize: '0.85rem', color: 'var(--txt-secondary)' }}>
                            {new Date(tx.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                          </td>
                          <td style={{ fontWeight: 700, color: '#ffffff' }}>{fiiCode}</td>
                          <td>
                            <span className={`badge badge-${tx.type.toLowerCase()}`}>{tx.type}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>{tx.quantity}</td>
                          <td style={{ textAlign: 'right' }}>
                            R$ {tx.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 600 }}>
                            R$ {tx.totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(tx.id)}>Excluir</button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
