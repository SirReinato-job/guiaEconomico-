import { useState } from "react";
import { useGastos } from "../context/GastosContext";
import { useSaldo } from "../context/SaldoContext";
import { useEssencial } from "../context/EssencialContext";

export function useShowModals() {
    const [showModalGasto, setShowModalGasto] = useState(false);
    const [showModalSaldo, setShowModalSaldo] = useState(false);
    const [showModalEssencial, setShowModalEssencial] = useState(false);

    const { adicionarGasto } = useGastos();
    const { adicionarReceita } = useSaldo();
    const { adicionarEssencial } = useEssencial();

    return {
        // Modais
        showModalGasto,
        setShowModalGasto,
        showModalSaldo,
        setShowModalSaldo,
        showModalEssencial,
        setShowModalEssencial,

        // Ações
        adicionarGasto,
        adicionarReceita,
        adicionarEssencial,
    };
}
