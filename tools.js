function showSuccessToast(message) {
    const toastElement = document.getElementById('liveToast');
    const toastMessage = document.getElementById('toastMessage');
    if (toastMessage) {
        toastMessage.textContent = message;
    }
    else {
        console.error("Element with id 'toastMessage' not found.");
    }
    if (toastElement) {
        // On récupère ou on crée l'instance du Toast
        const toast = bootstrap.Toast.getOrCreateInstance(toastElement);
        toast.show();
    }
    else {
        console.error("Element with id 'liveToast' not found.");
    }
}

function clearStats(mode) {
    if (confirm("Effacer toutes tes données ?")) {
        let history = JSON.parse(localStorage.getItem(mode)) || [];
        localStorage.removeItem(mode);
        history = [];
        if (mode == 'dbdMatches') {
            updateDisplayNormal(history);
        }
        else if (mode == 'dbdMatches2v8') {
            updateDisplay2v8(history);
        }
        showSuccessToast("Les données ont été réinitialisées !");
    }
}

function removeLastEntry(mode) {
    let history = JSON.parse(localStorage.getItem(mode)) || [];
    if (history.length === 0) {
        showSuccessToast("Aucune entrée à supprimer !");
        return;
    }
    const lastMatch = history[history.length - 1];
    let killerInfo = "";
    if (mode == 'dbdMatches') {
        killerInfo = lastMatch.killer;
    }
    else if (mode == 'dbdMatches2v8') {
        killerInfo = lastMatch?.killer1 + " et " + lastMatch?.killer2
    }

    if (confirm("Supprimer la dernière entrée ? (Tueur : " + killerInfo + ")")) {
        history.pop();
        // Save the updated history to localStorage
        localStorage.setItem(mode, JSON.stringify(history));
        if (mode == 'dbdMatches') {
            updateDisplayNormal(history);
        }
        else if (mode == 'dbdMatches2v8') {
            updateDisplay2v8(history);
        }

        showSuccessToast("Dernière entrée supprimée !");
    }
}