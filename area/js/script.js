document.getElementById('unitSelect').addEventListener('change', function() {
    const selectedUnit = this.value;
    const singleInputGroup = document.getElementById('singleInputGroup');
    const bighaKathaDhurGroup = document.getElementById('bighaKathaDhurGroup');
    const ropaniAnaPaisaDamGroup = document.getElementById('ropaniAnaPaisaDamGroup');

    singleInputGroup.style.display = 'none';
    bighaKathaDhurGroup.style.display = 'none';
    ropaniAnaPaisaDamGroup.style.display = 'none';

    if (selectedUnit === 'bighaKathaDhur') {
        bighaKathaDhurGroup.style.display = 'block';
    } else if (selectedUnit === 'ropaniAnaPaisaDam') {
        ropaniAnaPaisaDamGroup.style.display = 'block';
    } else {
        singleInputGroup.style.display = 'block';
    }

    convertUnits();
});

// Add event listeners for all inputs
document.getElementById('inputValue').addEventListener('input', convertUnits);
document.getElementById('bighaInput').addEventListener('input', convertUnits);
document.getElementById('kathaInput').addEventListener('input', convertUnits);
document.getElementById('dhurInput').addEventListener('input', convertUnits);
document.getElementById('ropaniInput').addEventListener('input', convertUnits);
document.getElementById('anaInput').addEventListener('input', convertUnits);
document.getElementById('paisaInput').addEventListener('input', convertUnits);
document.getElementById('damInput').addEventListener('input', convertUnits);

// Update the clear button function
document.getElementById('clearButton').addEventListener('click', function() {
    document.getElementById('inputValue').value = '';
    document.getElementById('bighaInput').value = '';
    document.getElementById('kathaInput').value = '';
    document.getElementById('dhurInput').value = '';
    document.getElementById('ropaniInput').value = '';
    document.getElementById('anaInput').value = '';
    document.getElementById('paisaInput').value = '';
    document.getElementById('damInput').value = '';
    document.getElementById('results').innerHTML = '';
});

function convertUnits() {
    const selectedUnit = document.getElementById('unitSelect').value;
    const resultsDiv = document.getElementById('results');
    let inputValue;

    if (selectedUnit === 'bighaKathaDhur') {
        let bigha = parseFloat(document.getElementById('bighaInput').value) || 0;
        let katha = parseFloat(document.getElementById('kathaInput').value) || 0;
        let dhur = parseFloat(document.getElementById('dhurInput').value) || 0;

        // Convert everything to Dhur
        let totalDhur = (bigha * 20 * 20) + (katha * 20) + dhur;

        // Convert to square meters
        const squareMeters = totalDhur * 16.93;
        inputValue = squareMeters / 4046.86; //  Convert to acres
    } else if (selectedUnit === 'ropaniAnaPaisaDam') {
        let ropani = parseFloat(document.getElementById('ropaniInput').value) || 0;
        let ana = parseFloat(document.getElementById('anaInput').value) || 0;
        let paisa = parseFloat(document.getElementById('paisaInput').value) || 0;
        let dam = parseFloat(document.getElementById('damInput').value) || 0;

        // Convert everything to Dam
        let totalDam = (ropani * 16 * 4 * 4) + (ana * 4 * 4) + (paisa * 4) + dam;

        // Convert to square meters
        const squareMeters = totalDam * 1.99;
        inputValue = squareMeters / 4046.86; // Convert to acres
    } else {
        inputValue = parseFloat(document.getElementById('inputValue').value);
    }

    if (isNaN(inputValue)) {
        resultsDiv.innerHTML = 'Please enter valid numbers.';
        return;
    }

    let conversions = {
        acre: inputValue,
        hectare: inputValue * 0.404686,
        squareMeter: inputValue * 4046.86,
        squareFeet: inputValue * 43560,
        bighaKathaDhur: {
            bigha: 0,
            katha: 0,
            dhur: 0
        },
        ropaniAnaPaisaDam: {
            ropani: 0,
            ana: 0,
            paisa: 0,
            dam: 0
        }
    };

    // Convert acres to Bigha-Katha-Dhur
    let totalDhur = Math.round(inputValue * 4046.86 / 16.93);
    conversions.bighaKathaDhur.bigha = Math.floor(totalDhur / (20 * 20));
    conversions.bighaKathaDhur.katha = Math.floor((totalDhur % (20 * 20)) / 20);
    conversions.bighaKathaDhur.dhur = totalDhur % 20;

    // Convert acres to Ropani-Ana-Paisa-Dam
    let totalDam = Math.round(inputValue * 4046.86 / 1.99);
    conversions.ropaniAnaPaisaDam.ropani = Math.floor(totalDam / (16 * 4 * 4));
    conversions.ropaniAnaPaisaDam.ana = Math.floor((totalDam % (16 * 4 * 4)) / (4 * 4));
    conversions.ropaniAnaPaisaDam.paisa = Math.floor((totalDam % (4 * 4)) / 4);
    conversions.ropaniAnaPaisaDam.dam = totalDam % 4;

    if (selectedUnit !== 'acre' && selectedUnit !== 'bighaKathaDhur' && selectedUnit !== 'ropaniAnaPaisaDam') {
        const factor = conversions[selectedUnit] / inputValue;
        for (let unit in conversions) {
            if (typeof conversions[unit] === 'number') {
                conversions[unit] /= factor;
            }
        }

        // Recalculate Bigha-Katha-Dhur and Ropani-Ana-Paisa-Dam for non-acre units
        totalDhur = Math.round(conversions.acre * 4046.86 / 16.93);
        conversions.bighaKathaDhur.bigha = Math.floor(totalDhur / (20 * 20));
        conversions.bighaKathaDhur.katha = Math.floor((totalDhur % (20 * 20)) / 20);
        conversions.bighaKathaDhur.dhur = totalDhur % 20;

        totalDam = Math.round(conversions.acre * 4046.86 / 1.99);
        conversions.ropaniAnaPaisaDam.ropani = Math.floor(totalDam / (16 * 4 * 4));
        conversions.ropaniAnaPaisaDam.ana = Math.floor((totalDam % (16 * 4 * 4)) / (4 * 4));
        conversions.ropaniAnaPaisaDam.paisa = Math.floor((totalDam % (4 * 4)) / 4);
        conversions.ropaniAnaPaisaDam.dam = totalDam % 4;
    }

    resultsDiv.innerHTML = `
        ${conversions.acre.toFixed(4)} Acres<br>
        ${conversions.hectare.toFixed(4)} Hectares<br>
        ${conversions.squareMeter.toFixed(4)} Square Meters<br>
        ${conversions.squareFeet.toFixed(4)} Square Feet<br>
        ${conversions.bighaKathaDhur.bigha} Bigha, ${conversions.bighaKathaDhur.katha} Katha, ${conversions.bighaKathaDhur.dhur} Dhur<br>
        ${conversions.ropaniAnaPaisaDam.ropani} Ropani, ${conversions.ropaniAnaPaisaDam.ana} Ana, ${conversions.ropaniAnaPaisaDam.paisa} Paisa, ${conversions.ropaniAnaPaisaDam.dam} Dam
    `;
}