// Dummy result display logic
document.getElementById("result-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const resultOutput = document.getElementById("result-output");
  resultOutput.innerHTML = `
    <h3>Result Summary</h3>
    <p>Math: 90</p>
    <p>English: 85</p>
    <p>Science: 88</p>
    <p>Total: 263 / 300</p>
    <p>Status: <strong>Passed</strong></p>
  `;
});