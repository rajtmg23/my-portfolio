document.getElementById('unitSelect').addEventListener('change', function() {
    const selectedUnit = this.value;
    const singleInputGroup = document.getElementById('singleInputGroup');
    const bighaKathaDhurGroup = document.getElementById('bighaKathaDhurGroup');

    if (selectedUnit === 'bighaKathaDhur') {
        singleInputGroup.style.display = 'none';
        bighaKathaDhurGroup.style.display = 'block';
    } else {
        singleInputGroup.style.display = 'block';
        bighaKathaDhurGroup.style.display = 'none';
    }

    convertUnits();
});

document.getElementById('inputValue').addEventListener('input', convertUnits);
document.getElementById('bighaInput').addEventListener('input', convertUnits);
document.getElementById('kathaInput').addEventListener('input', convertUnits);
document.getElementById('dhurInput').addEventListener('input', convertUnits);

document.getElementById('clearButton').addEventListener('click', function() {
    document.getElementById('inputValue').value = '';
    document.getElementById('bighaInput').value = '';
    document.getElementById('kathaInput').value = '';
    document.getElementById('dhurInput').value = '';
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

// Convert Dhur back to Bigha-Katha-Dhur
bigha = Math.floor(totalDhur / (20 * 20));
katha = Math.floor((totalDhur % (20 * 20)) / 20);
dhur = totalDhur % 20;

// Convert to square meters
const squareMeters = totalDhur * 16.93;
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
bighaKathaDhur: {
    bigha: 0,
    katha: 0,
    dhur: 0
}
};

// Convert acres to Bigha-Katha-Dhur
let totalDhur = Math.round(inputValue * 4046.86 / 16.93);
conversions.bighaKathaDhur.bigha = Math.floor(totalDhur / (20 * 20));
conversions.bighaKathaDhur.katha = Math.floor((totalDhur % (20 * 20)) / 20);
conversions.bighaKathaDhur.dhur = totalDhur % 20;

if (selectedUnit !== 'acre' && selectedUnit !== 'bighaKathaDhur') {
const factor = conversions[selectedUnit] / inputValue;
conversions.acre /= factor;
conversions.hectare /= factor;
conversions.squareMeter /= factor;

// Recalculate Bigha-Katha-Dhur for non-acre units
totalDhur = Math.round(conversions.acre * 4046.86 / 16.93);
conversions.bighaKathaDhur.bigha = Math.floor(totalDhur / (20 * 20));
conversions.bighaKathaDhur.katha = Math.floor((totalDhur % (20 * 20)) / 20);
conversions.bighaKathaDhur.dhur = totalDhur % 20;
}

resultsDiv.innerHTML = `
${conversions.acre.toFixed(4)} Acres<br>
${conversions.hectare.toFixed(4)} Hectares<br>
${conversions.squareMeter.toFixed(4)} Square Meters<br>
${conversions.bighaKathaDhur.bigha} Bigha, ${conversions.bighaKathaDhur.katha} Katha, ${conversions.bighaKathaDhur.dhur} Dhur
`;
}