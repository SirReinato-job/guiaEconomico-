import styled from "styled-components";
import { HeaderContainer } from "../Home";
import Card, { Titulos } from "../../components/Card";
import { useGastos } from "../../context/GastosContext";
import { useState, useMemo } from "react";
import { parseCurrency } from "../../utils/currencyUtils";
import { useMes } from "../../context/MesContext";
import { useResumoFinanceiro } from "../../hooks/useResumoFinanceiro";
import ModalEditarGasto from "../../components/ModalEditarGasto";

export default function Cartoes() {
    const {
        getFaturaPorCartao,
        getGastosDoCiclo,
        atualizarGasto,
        removerGasto,
    } = useGastos();
    const {
        nomeMesAno,
        mesReferencia,
        estaPago,
        confirmarMesPago,
        avancarMes,
        voltarMes,
    } = useMes();

    // estado para controlar ciclo ativo
    const [ciclo, setCiclo] = useState("atual");
    const [cartaoSelecionado, setCartaoSelecionado] = useState("todos");
    const [responsavelSelecionado, setResponsavelSelecionado] = useState("todos");
    const [gastoParaEditar, setGastoParaEditar] = useState(null);

    const { saldoLiquido } = useResumoFinanceiro();
    const fatura = getFaturaPorCartao(ciclo, mesReferencia);
    const gastos = ["Nubank", "Picpay", "Banco do Brasil"].map((cartao) => ({
        cartao,
        valor: fatura[cartao] ? fatura[cartao].toFixed(2) : "0.00",
    }));

    const cartoesInfo = useMemo(
        () => [
            { id: "Nubank", nome: "Nubank", cor: "#820ad1", icone: "🟣" },
            { id: "Banco do Brasil", nome: "Banco do Brasil", cor: "#eab308", icone: "🟡" },
            { id: "Picpay", nome: "Picpay", cor: "#10b981", icone: "🟢" },
        ],
        []
    );

    // lista detalhada dos gastos do ciclo ativo por cartão
    const gastosNubank = useMemo(
        () => getGastosDoCiclo("Nubank", ciclo, mesReferencia),
        [getGastosDoCiclo, ciclo, mesReferencia]
    );
    const gastosPicpay = useMemo(
        () => getGastosDoCiclo("Picpay", ciclo, mesReferencia),
        [getGastosDoCiclo, ciclo, mesReferencia]
    );
    const gastosBB = useMemo(
        () => getGastosDoCiclo("Banco do Brasil", ciclo, mesReferencia),
        [getGastosDoCiclo, ciclo, mesReferencia]
    );

    const todosGastosDoCiclo = useMemo(() => {
        return [...gastosNubank, ...gastosBB, ...gastosPicpay].sort((a, b) => {
            const dataA = new Date(a.data?.includes("T") ? a.data : `${a.data}T12:00:00`);
            const dataB = new Date(b.data?.includes("T") ? b.data : `${b.data}T12:00:00`);
            return dataB - dataA;
        });
    }, [gastosNubank, gastosBB, gastosPicpay]);

    // Gastos filtrados pelo cartão selecionado
    const gastosPorCartao = useMemo(() => {
        if (cartaoSelecionado === "todos") return todosGastosDoCiclo;
        return todosGastosDoCiclo.filter(
            (g) => g.cartao?.toLowerCase() === cartaoSelecionado.toLowerCase()
        );
    }, [todosGastosDoCiclo, cartaoSelecionado]);

    // Auditoria dos responsáveis dentro do universo do cartão selecionado
    const auditoriaResponsavel = useMemo(() => {
        let totalGeral = 0;
        let totalMeu = 0;
        let totalMozi = 0;
        let totalDividido = 0;
        let qtdMeu = 0;
        let qtdMozi = 0;
        let qtdDividido = 0;

        gastosPorCartao.forEach((g) => {
            const v = parseCurrency(g.valor);
            const resp = g.responsavel || "meu";
            totalGeral += v;

            if (resp === "mozi") {
                totalMozi += v;
                qtdMozi += 1;
            } else if (resp === "dividido") {
                totalDividido += v;
                qtdDividido += 1;
            } else {
                totalMeu += v;
                qtdMeu += 1;
            }
        });

        return {
            todos: { count: gastosPorCartao.length, total: totalGeral },
            meu: { count: qtdMeu, total: totalMeu },
            mozi: { count: qtdMozi, total: totalMozi },
            dividido: { count: qtdDividido, total: totalDividido },
        };
    }, [gastosPorCartao]);

    // Gastos finais filtrados por cartão E por responsável
    const gastosFiltrados = useMemo(() => {
        if (responsavelSelecionado === "todos") return gastosPorCartao;
        return gastosPorCartao.filter((g) => {
            const resp = g.responsavel || "meu";
            return resp === responsavelSelecionado;
        });
    }, [gastosPorCartao, responsavelSelecionado]);

    const totalFiltrado = useMemo(() => {
        return gastosFiltrados.reduce((acc, g) => acc + parseCurrency(g.valor), 0);
    }, [gastosFiltrados]);

    const contagens = useMemo(
        () => ({
            todos: todosGastosDoCiclo.length,
            Nubank: gastosNubank.length,
            "Banco do Brasil": gastosBB.length,
            Picpay: gastosPicpay.length,
        }),
        [todosGastosDoCiclo, gastosNubank, gastosBB, gastosPicpay]
    );

    return (
        <ContainerLista>
            <HeaderNavegacaoMes>
                <BotaoNavegacao onClick={voltarMes} title="Mês anterior">
                    ◀
                </BotaoNavegacao>
                <Titulos $titulo $tituloRoxo>
                    {nomeMesAno}
                </Titulos>
                <BotaoNavegacao onClick={avancarMes} title="Próximo mês">
                    ▶
                </BotaoNavegacao>
            </HeaderNavegacaoMes>

            <BarraStatusMes>
                {estaPago ? (
                    <BadgePago>✓ Todas as contas deste mês foram pagas</BadgePago>
                ) : (
                    <BotaoConfirmarPago onClick={() => confirmarMesPago(parseFloat(saldoLiquido))}>
                        ✓ Confirmar tudo pago e avançar mês
                    </BotaoConfirmarPago>
                )}
            </BarraStatusMes>

            {/* Filtro de ciclo */}
            <Filtro>
                <button
                    className={ciclo === "atual" ? "ativo" : ""}
                    onClick={() => setCiclo("atual")}
                >
                    Atual
                </button>
                <button
                    className={ciclo === "anterior" ? "ativo" : ""}
                    onClick={() => setCiclo("anterior")}
                >
                    Anterior
                </button>
                <button
                    className={ciclo === "proximo" ? "ativo" : ""}
                    onClick={() => setCiclo("proximo")}
                >
                    Próximo
                </button>
            </Filtro>

            <HeaderContainer>
                {gastos.map((g) => {
                    const isSelecionado = cartaoSelecionado === g.cartao;
                    return (
                        <Card
                            key={g.cartao}
                            $bgAlert
                            $widthSm
                            $heightSm
                            $bgClaro
                            titulo={g.cartao}
                            destaque={`R$ ${g.valor}`}
                            textTitulo={["Fatura", "Limite Disponível"]}
                            textDescricao={[
                                `Ciclo: ${ciclo}`,
                                "R$ 2.600,00", // mock do limite
                            ]}
                            onClick={() =>
                                setCartaoSelecionado(isSelecionado ? "todos" : g.cartao)
                            }
                            style={{
                                cursor: "pointer",
                                outline: isSelecionado ? "2px solid #820ad1" : "2px solid transparent",
                                boxShadow: isSelecionado ? "0 0 14px rgba(130, 10, 209, 0.45)" : undefined,
                                transform: isSelecionado ? "scale(1.02)" : "scale(1)",
                                transition: "all 0.2s ease",
                            }}
                        />
                    );
                })}
            </HeaderContainer>

            {/* Barra de Botões para Filtrar Especificamente por Cartão */}
            <BarraFiltroCartoes>
                <BotaoFiltroCartao
                    $ativo={cartaoSelecionado === "todos"}
                    onClick={() => setCartaoSelecionado("todos")}
                >
                    💳 Todos os Cartões ({contagens.todos})
                </BotaoFiltroCartao>
                {cartoesInfo.map((c) => (
                    <BotaoFiltroCartao
                        key={c.id}
                        $cor={c.cor}
                        $ativo={cartaoSelecionado === c.id}
                        onClick={() => setCartaoSelecionado(c.id)}
                    >
                        <span>{c.icone}</span>
                        <span>{c.nome}</span>
                        <BadgeContagem $ativo={cartaoSelecionado === c.id}>
                            {contagens[c.id] || 0}
                        </BadgeContagem>
                    </BotaoFiltroCartao>
                ))}
            </BarraFiltroCartoes>

            {/* Barra de Auditoria: Filtro por Responsável pelo Gasto */}
            <BarraFiltroResponsavel>
                <LabelFiltroSecao>Auditoria:</LabelFiltroSecao>
                <BotaoFiltroResponsavel
                    $tipo="todos"
                    $ativo={responsavelSelecionado === "todos"}
                    onClick={() => setResponsavelSelecionado("todos")}
                >
                    👥 Todos ({auditoriaResponsavel.todos.count})
                </BotaoFiltroResponsavel>
                <BotaoFiltroResponsavel
                    $tipo="meu"
                    $ativo={responsavelSelecionado === "meu"}
                    onClick={() => setResponsavelSelecionado("meu")}
                >
                    👤 Meu ({auditoriaResponsavel.meu.count})
                </BotaoFiltroResponsavel>
                <BotaoFiltroResponsavel
                    $tipo="mozi"
                    $ativo={responsavelSelecionado === "mozi"}
                    onClick={() => setResponsavelSelecionado("mozi")}
                    title="Gastos 100% da Mozi a serem reembolsados"
                >
                    💕 Mozi ({auditoriaResponsavel.mozi.count}
                    {auditoriaResponsavel.mozi.total > 0 &&
                        ` • R$ ${auditoriaResponsavel.mozi.total.toFixed(2)}`}
                    )
                </BotaoFiltroResponsavel>
                <BotaoFiltroResponsavel
                    $tipo="dividido"
                    $ativo={responsavelSelecionado === "dividido"}
                    onClick={() => setResponsavelSelecionado("dividido")}
                    title="Gastos divididos (50% cada)"
                >
                    🤝 Dividido ({auditoriaResponsavel.dividido.count}
                    {auditoriaResponsavel.dividido.total > 0 &&
                        ` • R$ ${(auditoriaResponsavel.dividido.total / 2).toFixed(2)} cada`}
                    )
                </BotaoFiltroResponsavel>
            </BarraFiltroResponsavel>

            {(cartaoSelecionado !== "todos" || responsavelSelecionado !== "todos") && (
                <InfoFiltroAtivo>
                    <span>
                        Filtrando:{" "}
                        {cartaoSelecionado !== "todos" && (
                            <>
                                Cartão: <strong>{cartaoSelecionado}</strong>
                            </>
                        )}
                        {cartaoSelecionado !== "todos" && responsavelSelecionado !== "todos" && " • "}
                        {responsavelSelecionado !== "todos" && (
                            <>
                                Responsável:{" "}
                                <strong>
                                    {responsavelSelecionado === "mozi"
                                        ? "💕 Mozi (Reembolsável)"
                                        : responsavelSelecionado === "dividido"
                                        ? "🤝 Dividido (50% cada)"
                                        : "👤 Meu"}
                                </strong>
                            </>
                        )}
                        {" "}• <strong>{gastosFiltrados.length}</strong> compras • Subtotal:{" "}
                        <strong>R$ {totalFiltrado.toFixed(2)}</strong>
                        {responsavelSelecionado === "mozi" && totalFiltrado > 0 && (
                            <span style={{ color: "#f472b6", marginLeft: "6px", fontWeight: "bold" }}>
                                (Total a reembolsar)
                            </span>
                        )}
                    </span>
                    <BotaoLimparFiltro
                        onClick={() => {
                            setCartaoSelecionado("todos");
                            setResponsavelSelecionado("todos");
                        }}
                    >
                        ✕ Limpar filtros
                    </BotaoLimparFiltro>
                </InfoFiltroAtivo>
            )}

            <ListaGastos>
                {gastosFiltrados.length > 0 ? (
                    gastosFiltrados.map((gasto) => (
                        <ItemGasto key={gasto.id}>
                            <Coluna>{gasto.data}</Coluna>
                            <Coluna>
                                R$ {parseCurrency(gasto.valor).toFixed(2)}
                            </Coluna>
                            <Coluna>{gasto.cartao}</Coluna>
                            <Coluna tipo={gasto.tipo}>{gasto.tipo}</Coluna>
                            <Coluna>
                                {gasto.categoria}
                                {gasto.parcela ? ` (${gasto.parcela})` : ""}
                                {gasto.responsavel === "mozi" && (
                                    <BadgeResponsavel $tipo="mozi">💕 Mozi</BadgeResponsavel>
                                )}
                                {gasto.responsavel === "dividido" && (
                                    <BadgeResponsavel $tipo="dividido">🤝 50% Mozi</BadgeResponsavel>
                                )}
                            </Coluna>
                            <BotaoEditar onClick={() => setGastoParaEditar(gasto)}>
                                Editar
                            </BotaoEditar>
                        </ItemGasto>
                    ))
                ) : (
                    <MensagemVazia>
                        Nenhum gasto encontrado
                        {cartaoSelecionado !== "todos" ? ` no cartão ${cartaoSelecionado}` : ""}
                        {responsavelSelecionado !== "todos"
                            ? ` para o responsável "${
                                  responsavelSelecionado === "mozi"
                                      ? "Mozi"
                                      : responsavelSelecionado === "dividido"
                                      ? "Dividido"
                                      : "Meu"
                              }"`
                            : ""} neste período.
                    </MensagemVazia>
                )}
            </ListaGastos>

            {gastoParaEditar && (
                <ModalEditarGasto
                    gasto={gastoParaEditar}
                    onClose={() => setGastoParaEditar(null)}
                    onUpdate={atualizarGasto}
                    onDelete={removerGasto}
                />
            )}
        </ContainerLista>
    );
}

const ContainerLista = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    gap: 8px;
    width: 100%;
    padding: 8px;
    border-radius: 16px;
    background-color: ${({ theme }) => theme.colors.cardsBg};
`;

const ListaGastos = styled.div`
    width: 100%;
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-sizing: border-box;
    overflow-y: auto;
    padding-right: 4px;

    scrollbar-width: thin;
    scrollbar-color: #820ad1 transparent;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #820ad1;
        border-radius: 8px;
        border: 2px solid transparent;
        background-clip: content-box;
    }
`;

const ItemGasto = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.cardItemBg || "#0d1b2a"};
    padding: 12px 16px;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Coluna = styled.div`
    flex: 1;
    font-size: 0.85em;
    font-weight: ${({ tipo }) => (tipo ? "bold" : "normal")};
    color: ${({ tipo }) => {
        if (tipo === "Essencial") return "#ff6b6b";
        if (tipo === "Desejo") return "#f9c74f";
        if (tipo === "Poupança") return "#43aa8b";
        return "#ffffff";
    }};
`;

const BotaoEditar = styled.button`
    background-color: transparent;
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.textPrimary};
    padding: 4px 8px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.8em;

    &:hover {
        background-color: ${({ theme }) => theme.colors.hoverBg || "#1a2636"};
    }
`;

const Filtro = styled.div`
    display: flex;
    gap: 12px;
    margin: 12px 0;

    button {
        padding: 6px 12px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        background-color: ${({ theme }) => theme.colors.cardsBg};
        color: ${({ theme }) => theme.colors.textPrimary};
        font-weight: bold;

        &.ativo {
            background-color: ${({ theme }) => theme.colors.primary};
            color: ${({ theme }) => theme.colors.surface};
        }
    }
`;

const HeaderNavegacaoMes = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 4px;
`;

const BotaoNavegacao = styled.button`
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #00b3ff;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s;

    &:hover {
        background: #00b3ff;
        color: #ffffff;
        transform: scale(1.1);
    }
`;

const BarraStatusMes = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
`;

const BotaoConfirmarPago = styled.button`
    background: linear-gradient(135deg, #10b981, #059669);
    color: #ffffff;
    border: none;
    padding: 8px 18px;
    border-radius: 20px;
    font-weight: bold;
    font-size: 0.9em;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(16, 185, 129, 0.5);
    }
`;

const BadgePago = styled.div`
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.3);
    padding: 6px 14px;
    border-radius: 16px;
    font-weight: bold;
    font-size: 0.85em;
    display: flex;
    align-items: center;
    gap: 6px;
`;

const BadgeResponsavel = styled.span`
    font-size: 0.75em;
    padding: 2px 6px;
    border-radius: 6px;
    margin-left: 6px;
    font-weight: bold;
    display: inline-block;
    ${({ $tipo }) =>
        $tipo === "mozi"
            ? `
        background: rgba(236, 72, 153, 0.2);
        color: #f472b6;
        border: 1px solid rgba(236, 72, 153, 0.4);
    `
            : `
        background: rgba(59, 130, 246, 0.2);
        color: #60a5fa;
        border: 1px solid rgba(59, 130, 246, 0.4);
    `}
`;

const BarraFiltroCartoes = styled.div`
    display: flex;
    gap: 10px;
    margin: 10px 0 4px 0;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
`;

const BotaoFiltroCartao = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.85em;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid
        ${({ $ativo, $cor, theme }) =>
            $ativo
                ? $cor || theme.colors.primary || "#820ad1"
                : "rgba(255, 255, 255, 0.12)"};
    background: ${({ $ativo, $cor }) =>
        $ativo
            ? $cor
                ? `linear-gradient(135deg, ${$cor}dd, ${$cor})`
                : "linear-gradient(135deg, #820ad1, #6200ea)"
            : "rgba(255, 255, 255, 0.05)"};
    color: ${({ $ativo, $cor }) => {
        if (!$ativo) return "#cbd5e1";
        if ($cor === "#eab308") return "#1e1e1e";
        return "#ffffff";
    }};
    box-shadow: ${({ $ativo, $cor }) =>
        $ativo
            ? `0 4px 12px ${$cor ? `${$cor}55` : "rgba(130, 10, 209, 0.4)"}`
            : "none"};

    &:hover {
        transform: translateY(-1px);
        background: ${({ $ativo }) =>
            $ativo
                ? undefined
                : "rgba(255, 255, 255, 0.1)"};
        color: #ffffff;
    }

    &:active {
        transform: scale(0.98);
    }
`;

const BadgeContagem = styled.span`
    font-size: 0.8em;
    padding: 2px 7px;
    border-radius: 12px;
    background: ${({ $ativo }) =>
        $ativo ? "rgba(0, 0, 0, 0.25)" : "rgba(255, 255, 255, 0.12)"};
    color: inherit;
    font-weight: bold;
`;

const InfoFiltroAtivo = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 8px 16px;
    background: rgba(130, 10, 209, 0.12);
    border: 1px solid rgba(130, 10, 209, 0.3);
    border-radius: 10px;
    font-size: 0.85em;
    color: #e2e8f0;
    margin-top: 4px;

    @media (max-width: 600px) {
        flex-direction: column;
        gap: 8px;
        align-items: flex-start;
    }
`;

const BotaoLimparFiltro = styled.button`
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #e2e8f0;
    font-size: 0.8em;
    padding: 4px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
    }
`;

const MensagemVazia = styled.div`
    color: #94a3b8;
    text-align: center;
    padding: 32px 16px;
    font-size: 0.9em;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 12px;
    border: 1px dashed rgba(255, 255, 255, 0.1);
    width: 100%;
`;

const BarraFiltroResponsavel = styled.div`
    display: flex;
    gap: 8px;
    margin: 4px 0 8px 0;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
`;

const LabelFiltroSecao = styled.span`
    font-size: 0.75em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #94a3b8;
    margin-right: 4px;

    @media (max-width: 600px) {
        width: 100%;
        text-align: center;
        margin-bottom: 2px;
    }
`;

const BotaoFiltroResponsavel = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 16px;
    font-size: 0.8em;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid
        ${({ $ativo, $tipo }) => {
            if (!$ativo) return "rgba(255, 255, 255, 0.12)";
            if ($tipo === "mozi") return "#ec4899";
            if ($tipo === "dividido") return "#3b82f6";
            if ($tipo === "meu") return "#10b981";
            return "#820ad1";
        }};
    background: ${({ $ativo, $tipo }) => {
        if (!$ativo) return "rgba(255, 255, 255, 0.04)";
        if ($tipo === "mozi") return "linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(219, 39, 119, 0.5))";
        if ($tipo === "dividido") return "linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.5))";
        if ($tipo === "meu") return "linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.5))";
        return "linear-gradient(135deg, rgba(130, 10, 209, 0.4), rgba(98, 0, 234, 0.5))";
    }};
    color: ${({ $ativo, $tipo }) => {
        if (!$ativo) return "#cbd5e1";
        if ($tipo === "mozi") return "#f472b6";
        if ($tipo === "dividido") return "#60a5fa";
        if ($tipo === "meu") return "#34d399";
        return "#ffffff";
    }};
    box-shadow: ${({ $ativo }) =>
        $ativo ? "0 2px 8px rgba(0, 0, 0, 0.3)" : "none"};

    &:hover {
        transform: translateY(-1px);
        background: ${({ $ativo }) =>
            $ativo ? undefined : "rgba(255, 255, 255, 0.08)"};
        color: #ffffff;
    }

    &:active {
        transform: scale(0.98);
    }
`;

