import React, { useState, useEffect } from 'react';
import { walletApi } from '../../services/walletApi';

export default function Dashboard({ addToast }) {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await walletApi.getWalletAll(selectedMonth);
      setPositions(data || []);
    } catch (err) {
      console.error(err);
      addToast('Erro ao carregar dados do dashboard.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedMonth]);


  const totalCost = positions.reduce((acc, curr) => acc + (curr.totalExpense || 0), 0);
  const totalGains = positions.reduce((acc, curr) => acc + (curr.totalGain || 0), 0);
  const totalQuantity = positions.reduce((acc, curr) => acc + (curr.totalAccumulatedQuantity || 0), 0);
  const averageYoc = totalCost > 0 ? (totalGains / totalCost) * 100 : 0;


  let mostProfitableFii = null;
  let maxFiiYoc = -1;

  positions.forEach(pos => {
    if (pos.totalExpense > 0) {
      const yoc = (pos.totalGain / pos.totalExpense) * 100;
      if (yoc > maxFiiYoc) {
        maxFiiYoc = yoc;
        mostProfitableFii = pos;
      }
    }
  });


  const allocationMap = {};
  positions.forEach(pos => {
    const t = pos.type || 'OUTROS';
    allocationMap[t] = (allocationMap[t] || 0) + (pos.totalExpense || 0);
  });
  const allocationList = Object.entries(allocationMap)
    .map(([type, value]) => ({ type, value, percentage: totalCost > 0 ? (value / totalCost) * 100 : 0 }))
    .sort((a, b) => b.value - a.value);

  const getTypeColor = (type) => {
    switch (type.toUpperCase()) {
      case 'PAPEL': return '#6366f1';
      case 'TIJOLO': return '#10b981';
      case 'VAREJO': return '#f59e0b';
      case 'AGRO': return '#ec4899';
      case 'LOGISTICA': return '#0ea5e9';
      default: return '#8b5cf6';
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Dashboard da Carteira</h1>
          <p className="page-subtitle">Visão geral consolidade de seus investimentos imobiliários</p>
        </div>

        <div>
          <label htmlFor="dashboard-month-select" className="form-label" style={{ marginRight: '8px', fontSize: '0.85rem' }}>Mês de Referência:</label>
          <input
            id="dashboard-month-select"
            type="month"
            className="form-control"
            style={{ width: '220px', display: 'inline-block' }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255, 255, 255, 0.1)',
            borderTopColor: '#6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <>
          { }
          <div className="metrics-grid">
            <div className="glass-card metric-card">
              <span className="metric-title">Patrimônio Acumulado (Custo)</span>
              <div className="metric-value">
                R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="metric-trend trend-up">Custo total de aquisição</div>
            </div>

            <div className="glass-card metric-card success">
              <span className="metric-title">Dividendos Totais Recebidos</span>
              <div className="metric-value">
                R$ {totalGains.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="metric-trend trend-up">▲ Rendimento passivo acumulado</div>
            </div>

            <div className="glass-card metric-card warning">
              <span className="metric-title">FII Mais Rentável</span>
              <div className="metric-value" style={{ fontSize: mostProfitableFii ? '1.5rem' : '1.8rem' }}>
                {mostProfitableFii ? `${mostProfitableFii.fiiCode} (${maxFiiYoc.toFixed(2)}%)` : '—'}
              </div>
              <div className="metric-trend" style={{ fontSize: '0.72rem', marginTop: '0.25rem', color: 'var(--txt-secondary)' }}>
                {mostProfitableFii ? (
                  <span>
                    Retorno: R$ {mostProfitableFii.totalGain.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} / Custo: R$ {mostProfitableFii.totalExpense.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </span>
                ) : (
                  'Retorno acumulado sobre investimento'
                )}
              </div>
            </div>

            <div className="glass-card metric-card info">
              <span className="metric-title">Total de Cotas</span>
              <div className="metric-value">{totalQuantity}</div>
              <div className="metric-trend">Soma de todas as cotas da carteira</div>
            </div>
          </div>

          { }
          <div className="dashboard-grid">
            <div className="glass-card scrollable-card">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Posição Consolidada</h2>

              {positions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--txt-secondary)' }}>
                  Nenhuma posição ativa encontrada para este período. Registre compras na aba de Transações.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>Ativo</th>
                        <th>Segmento</th>
                        <th style={{ textAlign: 'right' }}>Quantidade</th>
                        <th style={{ textAlign: 'right' }}>Preço Médio</th>
                        <th style={{ textAlign: 'right' }}>Total Investido</th>
                        <th style={{ textAlign: 'right' }}>Último Div.</th>
                        <th style={{ textAlign: 'right' }}>Total Proventos</th>
                        <th style={{ textAlign: 'right' }}>YOC FII</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map((pos) => {
                        const fiiYoc = pos.totalExpense > 0 ? (pos.totalGain / pos.totalExpense) * 100 : 0;
                        return (
                          <tr key={pos.fiiCode}>
                            <td style={{ fontWeight: 700, color: '#ffffff' }}>{pos.fiiCode}</td>
                            <td>
                              <span className={`badge badge-${pos.type ? pos.type.toLowerCase() : 'papel'}`}>
                                {pos.type}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>{pos.totalAccumulatedQuantity}</td>
                            <td style={{ textAlign: 'right' }}>
                              R$ {pos.averagePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 600 }}>
                              R$ {pos.totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td style={{ textAlign: 'right', color: '#10b981' }}>
                              R$ {(pos.unitValuePayment || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td style={{ textAlign: 'right', color: '#10b981', fontWeight: 600 }}>
                              R$ {(pos.totalGain || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 700 }}>
                              {fiiYoc.toFixed(2)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            { }
            <div className="glass-card">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Divisão por Segmento</h2>
              {positions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--txt-secondary)' }}>
                  Aguardando dados...
                </div>
              ) : (
                <div className="alloc-chart-container">
                  {allocationList.map((item) => (
                    <div className="alloc-item" key={item.type}>
                      <div className="alloc-meta">
                        <span className="alloc-name">
                          <span className="alloc-color-dot" style={{ backgroundColor: getTypeColor(item.type) }} />
                          {item.type}
                        </span>
                        <span className="alloc-val">
                          {item.percentage.toFixed(1)}% (R$ {item.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })})
                        </span>
                      </div>
                      <div className="alloc-bar-bg">
                        <div
                          className="alloc-bar-fill"
                          style={{ width: `${item.percentage}%`, backgroundColor: getTypeColor(item.type) }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
