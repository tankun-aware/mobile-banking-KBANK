const fs = require('fs');
const path = require('path');
const { css } = require('./reportCSS');


function convertImageToBase64(buffer) {
  return buffer.toString('base64');
}

let expectedDetail = [];
let previosTestCaseId = 0;
let passedTests = 0;
let failedTests = 0;
let skippedTests = 0;
let totalTests = 0;
async function ais_report() {
  const filePath = path.join(__dirname, '../test-results.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB', {  
    day: 'numeric',  
    month: 'long',  
    year: 'numeric',  
    timeZone: 'Asia/Bangkok'
  });
  const formattedTime = currentDate.toLocaleTimeString('en-GB', { 
    timeZone: 'Asia/Bangkok', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: true
  });

  (data.suites || []).forEach(suite => {
    (suite.suites || []).forEach(describe => {
      (describe.specs || []).forEach(spec => {
        (spec.tests || []).forEach(test => {
          const status = test.results[0].status;
          totalTests++;
          if (status === 'passed') passedTests++;
          if (status === 'failed') failedTests++;
          if (status === 'skipped') skippedTests++;
        });
      });
    });
  });

  let html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap" rel="stylesheet">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

      <link rel="icon" href="https://upload.wikimedia.org/wikipedia/en/2/26/Advanced_Info_Service_logo-en.svg" type="image/svg+xml">
      <link href="https://cdn.jsdelivr.net/gh/PrismJS/prism-themes/themes/prism-vsc-dark-plus.css" rel="stylesheet">
      <script src="https://cdn.jsdelivr.net/gh/PrismJS/prism@1.29.0/prism.js"></script>

      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

      <title>Test Report</title>
      ${css}
    </head>
    <body>
      <div class="loading-overlay" id="loadingOverlay">
        <div class="loading-spinner"></div>
      </div>
      <nav class="navbar navbar-expand-lg navbar-dark custom-navbar fixed-top">
        <div class="container-fluid">
          <div class="ms-auto">
              <button class="btn btn-light overviewbutton" onclick="location.href='#?overview'">Overview</button>
              <button class="btn btn-light me-4 alltestButton" onclick="location.href='#?alltest'">Test Case</button>   
          </div>
        </div>
      </nav>

      <div class="container mt-5 p-7">
        <div id="overview">
          <div class="row">
            <div class="col-md-6">
                <div class="card p-3 mb-3 message-box">
                    <h4>Overview</h4>
                    <p><strong>● Project Name: </strong>Mobile Banking KTB</p>
                    <p><strong>● Test Date: </strong>${formattedDate}</p>
                    <p><strong>● Test Time: </strong>${formattedTime} (Thailand Time)</p>
                    <p><strong>● Test Team: </strong>Automate test KIOSK</p>
                </div>
                <div class="card p-3 message-box">
                    <h4>Test Result Summary</h4>
                    <p><strong>● Total: </strong>${totalTests}</p>
                    <p><strong>● Passed: </strong>${passedTests} (${((passedTests / totalTests) * 100).toFixed(2)}%)</p>
                    <p><strong>● Failed: </strong>${failedTests} (${((failedTests / totalTests) * 100).toFixed(2)}%)</p>
                    <p><strong>● Skipped: </strong>${skippedTests} (${((skippedTests / totalTests) * 100).toFixed(2)}%)</p>
                    <p><strong>● Total Test Duration: </strong> ${(data.stats.duration / 1000).toFixed(2)} seconds</p>
                </div>
            </div>
            <div class="col-md-6">
                  <div class="card p-3">
                    <h4>Overview of Test Results</h4>
                    <div class="card p-3 text-center graph">
                      <canvas id="overviewChart"></canvas>
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Issues</th>
                                <th>%</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="color: #5AC3B6;">● Pass</td>
                                <td>${passedTests}</td>
                                <td>${((passedTests / totalTests) * 100).toFixed(2)}%</td>
                            </tr>
                            <tr>
                                <td style="color: #FF7B67;">● Fail</td>
                                <td>${failedTests}</td>
                                <td>${((failedTests / totalTests) * 100).toFixed(2)}%</td>
                            </tr>
                            <tr>
                                <td style="color: #ECE786;">● Skip</td>
                                <td>${skippedTests}</td>
                                <td>${((skippedTests / totalTests) * 100).toFixed(2)}%</td>
                            </tr>
                          </tbody>
                      </table>
                  </div>
             </div>
          </div>
      </div>
        <div class="all-test mb-5" id="test-cases">
          <div class="container mt-4">
            <div class="filter-bar p-3 mb-3 border rounded-3">
              <h4 class="text-center mb-3">Test Case Details</h4>
          
              <div class="filter-item d-flex flex-wrap justify-content-center gap-3">
                <input type="text" class="form-control filter-test-name" id="filter-test-name" placeholder="Search" style="max-width: 250px;">
                <select class="form-select filter-status" id="filter-status" style="max-width: 180px;">
                  <option value="">All Statuses</option>
                  <option value="passed">Passed</option>
                  <option value="failed">Failed</option>
                  <option value="skipped">Skipped</option>
                </select>
                <select class="form-select filter-describe" id="filter-describe" style="max-width: 200px;">
                  <option value="">All Describes</option>`;
  

  const describeSet = new Set();
  (data.suites || []).forEach(suite => {
    (suite.suites || []).forEach(describe => {
      describeSet.add(describe.title);
    });
  });
  describeSet.forEach(describe => {
    html += `<option value="${describe}">${describe}</option>`;
  });
  html += `
            </select>

            
            <button class="search-button-filter" onclick="applyFilters()">Search</button>
          </div>
          </div>
          </div>
          <div id="test-case-container" class="container mt-4">`;


  let testCaseId = 1;
  (data.suites || []).forEach(suite => {
    (suite.suites || []).forEach(describe => { 
      const hasTests = (describe.specs || []).some(spec =>
        (spec.tests || []).length > 0
      );
      

      if (hasTests) {
        html += `
        <div class="test-scenario border rounded-3 justify-content-center p-5 mb-5">
        <h4 class="describe-title text-center mt-n5" data-describe="${describe.title}">${describe.title}</h4>`;
        (describe.specs || []).forEach(spec => {
          (spec.tests || []).forEach(test => {
            const testName = spec.title;
            const status = test.results[0].status;
            const duration = test.results[0].duration;
            function stripAnsiCodes(input) {
              if (typeof input === 'string') {
                return input.replace(/\x1b\[[0-9;]*m/g, '');
              }
              return ''; 
            }
            const error = test.results[0].error ? stripAnsiCodes(test.results[0].error.message) : null;
            const snippet = test.results[0].error ? stripAnsiCodes(test.results[0].error.snippet) : null;
            const describeTitle = describe.title;
            const annotations = test.annotations || [];
            
            
            let annotationText = annotations.map(annotation => {
              const titleAnnotation = annotation.type;
              const descriptionAnnotation = annotation.description;
              let resultAnnotation = `<div class="description-text"><strong>${titleAnnotation}:</strong> ${descriptionAnnotation}</div>`

              if (titleAnnotation === 'skip' && descriptionAnnotation === undefined) {
                resultAnnotation =  `<div class="description-text"><strong></strong> This test case has been skipped.</div>`;
              }
              return resultAnnotation;
            }).join('');

            let imagesHtml = '';
            const nameCount = {};

            if (test.results[0].attachments && Array.isArray(test.results[0].attachments)) {
              test.results[0].attachments.forEach((attachment, index) => {
                if (attachment.body) {
                  let fileName = attachment.name;
                  if (nameCount[fileName]) {
                    nameCount[fileName] += 1;
                    fileName = `${attachment.name} - ${nameCount[fileName]}`;
                  } else {
                    nameCount[fileName] = 1;
                  }

                  const imageBase64 = convertImageToBase64(attachment.body);
                  imagesHtml += `
                    <div class="${fileName}"><strong>${fileName}</strong><p><img src="data:image/png;base64,${imageBase64}" alt="${fileName}" /></p></div>
                  `;
                }
              });
            }


                  
            let imagesHtml_2 = ''      
            if (imagesHtml) {
              imagesHtml_2 += `
                <div class="test-description-container" id="test-description-screenshot-${testCaseId}" style="margin-top: 20px;">
                  <div class="test-result-header">
                      <span class="test-result-icon">v</span> 
                      <p class="test-result-text">Screenshot</p>
                  </div>
                  <div class="test-result-details">
                    ${imagesHtml}
                  </div>
                </div>`;
            }

            
            let errorHtml = '';
            if (error) {
              let snippetHtml = '';
  
              if (snippet !== '') {
                snippetHtml = `
                  <pre><code id="code-snippet" class="language-javascript">${snippet}</code></pre>
                `;
              }
              errorHtml = `
                <div class="test-description-container" style="margin-top: 20px;">
                  <div class="test-result-header">
                      <span class="test-result-icon">v</span> 
                      <p class="test-result-text">Error</p>
                  </div>
                  <div class="test-result-details">
                    <pre><code id="code-snippet" class="language-javascript">${error}</code></pre>
                    ${snippetHtml}
                  </div>
                </div>  
              `;
            }

            let testSteps = [];
            let screenshotSteps = [];
            if (annotationText) {
              annotationText = annotationText.replace(
                /<div class="description-text"><strong>opentagClass:<\/strong> ([\s\S]*?)<\/div>/g,
                (match, testStep) => {
                  testStep = testStep.replace(/\n/g, '');
                  
                  let count = 1;
                  let originalTestStep = testStep;
          
                  while (testSteps.includes(testStep)) {
                    testStep = `${originalTestStep} (${count+1})`;
                    count++;
                  }
              
                  testSteps.push(testStep);
              
                  return `<div class="test-description-container">
                            <div class="test-result-header">
                                <span class="test-result-icon">v</span> 
                                <p class="test-result-text">${testStep}</p>
                            </div>
                            <div class="test-result-details">
                          `;
                }
              );

              annotationText = annotationText.replace(
                /<div class="description-text"><strong>0!@#\$%\^ScreenshotMoveToTestStep\^%\$#@!0:<\/strong> ([\s\S]*?)<\/div>/g,
                (match, screenshotText) => {
                  screenshotText = screenshotText.replace(/\n/g, '');
              
                  let count = 1;
                  let originalScreenshotText = screenshotText;
    
                  while (screenshotSteps.includes(screenshotText)) {
                    screenshotText = `${originalScreenshotText} - ${count+1}`;
                    count++;
                  }
                  screenshotSteps.push(screenshotText);
                  return `<div class="description-text"><strong>0!@#\$%\^ScreenshotMoveToTestStep\^%\$#@!0:</strong> ${screenshotText}</div>`;
                }
              );
              
              
              
              annotationText = annotationText.replace(
                /<div class="description-text"><strong>closetagClass:<\/strong> ([\s\S]*?)<\/div>/g,
                `</div>
                  </div>`
              );

              let currentSet = {};

              const matches = annotationText.match(
                /<div class="test-description-container">([\s\S]*?)<div class="description-text"><strong>0!@#\$%\^Expected Result\^%\$#@!0:<\/strong> ([\s\S]*?)<\/div>/gs
              );
              
              if (matches) {
                matches.forEach((match, index) => {
                  const containerContent = match.match(/<div class="test-description-container">([\s\S]*?)<div class="description-text"><strong>0!@#\$%\^Expected Result\^%\$#@!0:/s)[1];
                  const expectedResult = match.match(/<div class="description-text"><strong>0!@#\$%\^Expected Result\^%\$#@!0:<\/strong> ([\s\S]*?)<\/div>/)[1];
              
                  const testResultMatch = containerContent.match(/<p class="test-result-text">([\s\S]*?)<\/p>/g);
                  if (testResultMatch) {
                    const lastTestResultText = testResultMatch[testResultMatch.length - 1].match(/<p class="test-result-text">([\s\S]*?)<\/p>/)[1];
                    currentSet[lastTestResultText.trim()] = expectedResult.trim();
                  }
                });
              
                if (Object.keys(currentSet).length > 0) {
                  expectedDetail.push(currentSet);
                }
              }  
            
              annotationText = annotationText.replace(
                /<div class="description-text"><strong>0!@#\$%\^Expected Result\^%\$#@!0:<\/strong> ([\s\S]*?)<\/div>/g,
                (match, value) => {
                  return ''; 
                }
              );                
            }

             
              let testStepsHtml = testSteps
                .map((testStep, index) => {    
                  const numberTestCaseSkip = Math.max(testCaseId - previosTestCaseId - 1, 0);                  
                  let newexpectedDetail = ([expectedDetail[Number(testCaseId - 1)]]);
             
                
                  for (let index = 0; index < numberTestCaseSkip; index++) {
                    if (newexpectedDetail.length === 1 && newexpectedDetail[0] === undefined) {
                      expectedDetail.splice((testCaseId-(numberTestCaseSkip+1)), 0, {});
                      newexpectedDetail = [expectedDetail[(testCaseId - 1)]];                  
                    }
                  }
                  if (newexpectedDetail.length >= 1) {    
                    
                    const matchingDetail = newexpectedDetail.find(
                      (detail) => detail && detail[testStep]
                    );
                    const button = matchingDetail
                      ? `<button onclick="ExpectedResult(${testCaseId}, '${testStep}')">Expected Result</button>`
                      : '';
                    
                    previosTestCaseId = testCaseId;
                    return `
                      <div class="d-flex align-items-center justify-content-between testStepRow">
                        <div class="flex-grow-1 testStepContainer">
                          <div class="testStep">${testStep}</div> 
                        </div>
                        ${button}
                      </div>
                    `;
                }
              })
              .join('');
            
            
              let allTestStep = testStepsHtml ? `
                <div class="test-description-container" style="margin-bottom: 30px;">
                    <div class="test-result-header" id="test-step-header">
                        <span class="test-result-icon">v</span> 
                        <p class="test-result-text">Test Steps</p>
                    </div>
                    <div class="test-result-details">
                        ${testStepsHtml}
                    </div>
                </div>
              ` : '';           

          
            const testCaseHtml = `
            <a href="#?testId=${testCaseId}" class="test-case border rounded-2 text-decoration-none text-body my-3 p-2 d-block" 
              id="test-case-${testCaseId}" 
              data-status="${status}" 
              data-name="${testName}" 
              data-describe="${describe.title}">
                
                <div class="test-case-title-container d-flex align-items-center p-1">
                    <span class="material-icons test-icon ${status === 'passed' ? 'test-pass' : status === 'failed' ? 'test-fail' : 'test-skip'}">
                        ${status === 'passed' ? 'check_circle' : status === 'failed' ? 'cancel' : 'remove_circle'}
                    </span>
                    <p class="test-case-title fw-bold m-0 ms-2">${testName}</p>
                    <p class="duration ms-auto m-0 text-muted">${(duration / 1000).toFixed(2)} s</p>
                    <span class="test-duration-icon material-icons ms-2">access_time</span>
                </div>
            </a>
            <div class="test-case-content" id="test-case-content-${testCaseId}">
              <div class="test-case-detail" id="test-case-detail-${testCaseId}">
                  <div class="test-case-title" id="test-title">${testName}</div>
                  <p class="duration">
                    <span class="material-icons md-18 test-duration-icon">access_time</span>
                    ${(duration/ 1000).toFixed(2)} s
                  </p>
                  <div class="test-result-container">
                          ${allTestStep}
                          ${errorHtml}
                          ${annotationText}
                          ${imagesHtml_2}
                  </div>

                  <div class="scroll-to-testSteps">
                      <a class="scroll-top">Scroll to Top</a>
                  </div>    
              </div>
              <div class="expected-result" id="expected-result-${testCaseId}">
                <h5 class="mt-4">Expected Result</h5>
                <pre><code id="code-snippet" class="language-javascript">
        
                </code></pre>
              </div>
            </div>
            `;
            html += testCaseHtml;
            testCaseId++;
          });
        });
        html += `</div>`;
      }
    });

  });
  html += `
          </div>
        </div>
      </div>

      
      <script>
        function applyFilters() {
          const loadingOverlay = document.getElementById('loadingOverlay');
          loadingOverlay.style.display = 'flex';

          const searchButton = document.querySelector('.search-button-filter');
          searchButton.classList.add('loading');

          setTimeout(() => {
              searchButton.classList.remove('loading');
              loadingOverlay.style.display = 'none';
          }, 100);

          const statusFilter = document.getElementById('filter-status').value;
          const nameFilter = document.getElementById('filter-test-name').value.toLowerCase();
          const describeFilter = document.getElementById('filter-describe').value;

          const testScenarios = document.querySelectorAll('.test-scenario');
          const testCases = document.querySelectorAll('.test-case');
          const describeTitles = document.querySelectorAll('.describe-title');

          let hasResults = false;

          testCases.forEach(testCase => {
              const status = testCase.getAttribute('data-status');
              const name = testCase.getAttribute('data-name').toLowerCase();
              const describe = testCase.getAttribute('data-describe');

              const statusMatch = !statusFilter || status === statusFilter;
              const nameMatch = !nameFilter || name.includes(nameFilter);
              const describeMatch = !describeFilter || describe === describeFilter;

              if (statusMatch && nameMatch && describeMatch) {
                  testCase.style.display = 'block';
                  hasResults = true;
              } else {
                  testCase.style.display = 'none';
              }
          });

          describeTitles.forEach(title => {
              const describe = title.getAttribute('data-describe');
              const hasVisibleTests = Array.from(testCases).some(testCase =>
                  testCase.style.display === 'block' && testCase.getAttribute('data-describe') === describe
              );

              title.style.display = hasVisibleTests ? 'block' : 'none';
          });

          testScenarios.forEach(scenario => {
              const hasVisibleTests = Array.from(scenario.querySelectorAll('.test-case')).some(
                  testCase => testCase.style.display === 'block'
              );

              scenario.style.display = hasVisibleTests ? 'block' : 'none';
          });

          let resultMessage = document.getElementById('result-message');
          if (!resultMessage) {
              resultMessage = document.createElement('div');
              resultMessage.id = 'result-message';
              resultMessage.style.textAlign = 'center';
              resultMessage.style.marginTop = '10px';
              resultMessage.style.fontWeigth = 'bold';
              resultMessage.style.fontSize = '24px';
              resultMessage.textContent = 'Result not found';
              document.body.appendChild(resultMessage);
          }

          resultMessage.style.display = hasResults ? 'none' : 'block';
      }



      document.addEventListener('DOMContentLoaded', function() {
        const filterInputs = document.querySelectorAll('#filter-test-name, #filter-status, #filter-describe');
        filterInputs.forEach(input => {
          input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
              event.preventDefault();
              applyFilters();
            }
          });
        });
      });
      </script>


      <script>
        const expectedDetail = ${JSON.stringify(expectedDetail)};
        document.querySelectorAll('.test-result-header').forEach(header => {
            header.addEventListener('click', () => {
                const details = header.nextElementSibling;
                const icon = header.querySelector('.test-result-icon');
                if (details.classList.contains('hidden')) {
                    details.classList.remove('hidden');
                    icon.textContent = 'v';
                } else {
                    details.classList.add('hidden');
                    icon.textContent = '>';
                }
              });
          });


            function showOverview() {
              const style = '.all-test > * {display: none;} .overview {display: block;}';
              document.getElementById('dynamic-style').innerHTML = style;
            }

            function showAllTestCase() {
              const testId = TestStepId;
              if (currentTestStep !== null) {
                currentTestStep = null;
                const element = document.querySelector('#test-case-content-' + testId);
                const detail = document.querySelector('#test-case-detail-' + testId);
                const expected = document.querySelector('#expected-result-' + testId);
                const container = document.querySelector('.container');
                container.removeAttribute('style');
                element.removeAttribute('style');
                detail.removeAttribute('style');
                expected.removeAttribute('style');
                
                const style = '#overview * { display: none; } .all-test * { display: none; } #test-case-container .test-case-content, #test-case-detail-' + testId + ' { display: block; } #test-case-container, #test-case-detail-' + testId + ' * { display: block; }';
                document.getElementById('dynamic-style').innerHTML = style;
              }
              const allTestCases = document.querySelectorAll('.test-case');
              allTestCases.forEach(testCase => {
                testCase.style.display = 'block'
              });

              const alldescribe = document.querySelectorAll('.describe-title');
              alldescribe.forEach(describe => {
                describe.style.display = 'block'
              });
              const style = '#overview * {display: none;} .all-test {display: block;} .all-test .test-case-detail {display: none;}';
              document.getElementById('dynamic-style').innerHTML = style;
              window.scrollTo(0, 0);
            }

            function showTestCase(testId) {
              window.scrollTo(0, 0);
              highlightLastTestStepIfError(testId);
              const testIdbefore = TestStepId;
              if (currentTestStep !== null) {
                currentTestStep = null;
                const element = document.querySelector('#test-case-content-' + testIdbefore);
                const detail = document.querySelector('#test-case-detail-' + testIdbefore);
                const expected = document.querySelector('#expected-result-' + testIdbefore);
                const container = document.querySelector('.container');
                container.removeAttribute('style');
                element.removeAttribute('style');
                detail.removeAttribute('style');
                expected.removeAttribute('style')

                const style = 'body { overflow: hidden; } .container { visibility: hidden; } #test-case-content-'+testIdbefore+'{ visibility: visible; display: block; position: absolute; top: 40px; left: 0; width: 100%; max-height: 90vh; overflow-y: auto; }';
                document.getElementById('dynamic-style').innerHTML = style;
              }

              const allTestCases = document.querySelectorAll('.test-case');
              allTestCases.forEach(testCase => {
                testCase.style.display = 'none'
              });

              const alldescribe = document.querySelectorAll('.describe-title');
              alldescribe.forEach(describe => {
                describe.style.display = 'none'
              });
              const style = 'body { overflow: hidden; } .container { visibility: hidden; } #test-case-content-'+testId+'{ visibility: visible; display: block; position: absolute; top: 40px; left: 0; width: 100%; max-height: 90vh; overflow-y: auto; }';
              document.getElementById('dynamic-style').innerHTML = style;
              
            }

            function handleHashChange() {
                const hash = location.hash;
                const params = new URLSearchParams(hash.slice(1));
                const testId = params.get('testId');
                
                if (testId) {
                    showTestCase(testId);
                }
                else if (hash === '#?alltest') {
                    showAllTestCase();
                }
                else if (hash === '#?overview') {
                    showOverview();
                }
                else {
                    showAllTestCase();
                }                 
            }

            window.addEventListener('hashchange', handleHashChange);
            window.addEventListener('DOMContentLoaded', handleHashChange);
            
            document.querySelectorAll('.scroll-to-testSteps .scroll-top').forEach((button) => {
              button.addEventListener('click', () => {
                const testCaseContent = button.closest('.test-case-content');
                const testCaseDetail = button.closest('.test-case-detail');
                const container = (testCaseContent && testCaseContent.scrollHeight > testCaseContent.clientHeight) 
                                  ? testCaseContent 
                                  : testCaseDetail;

                if (container) {
                  container.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  });
                }
              });
            });

          document.querySelectorAll('[class^="testStep"]').forEach((testStepDiv) => {
            testStepDiv.addEventListener('click', () => {
              const stepText = testStepDiv.textContent.trim();
              const container = testStepDiv.closest('.test-case-content');
              const containerDetail = testStepDiv.closest('.test-case-detail');

              if (container) {
                const targetParagraph = Array.from(container.querySelectorAll('.test-result-text'))
                  .find(p => p.textContent.trim() === stepText);

                if (targetParagraph) {
                  const yOffset = -60;
                  const y = targetParagraph.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop + (yOffset+40);

                  if (container.scrollHeight > container.clientHeight) {
                    container.scrollTo({
                      top: y,
                      behavior: 'smooth'
                    });
                  } else {
                    containerDetail.scrollTo({
                      top: targetParagraph.getBoundingClientRect().top + window.pageYOffset + yOffset,
                      behavior: 'smooth'
                    });
                  }
                }
              }
            });
          });
          
          let currentTestStep = null;
          let TestStepId = null;
          function ExpectedResult(testId, testStep) {
            const before = currentTestStep
            if (currentTestStep === null) {
              currentTestStep = testStep;
              TestStepId = testId;
            };
            updateExpectedResult(testId, testStep);
            const after = currentTestStep
            if (before === after) {
              currentTestStep = null;
              TestStepId = testId;
            }
          }

          function updateExpectedResult(testId, testStep) {
            if (currentTestStep === testStep) {
                showExpectedResult(testId); 
            } 

            const expectedResult = expectedDetail[testId-1][testStep];
            const expectedResultElement = document.getElementById('expected-result-' + testId);
            const testCaseContainer = document.querySelector('#test-case-container #test-case-content-'+ testId);
            const paragraph = expectedResultElement.querySelector('code');

            expectedResultElement.style.transition = 'opacity 0.3s ease-out';
            testCaseContainer.style.transition = 'transform 0.3s ease-out';
            
            expectedResultElement.style.opacity = '0';
            testCaseContainer.style.transform = 'translateY(-10px)';

            setTimeout(() => {
                paragraph.textContent = expectedResult;
                Prism.highlightElement(paragraph);
                
                expectedResultElement.style.opacity = '1';
                testCaseContainer.style.transform = '';
            }, 150);   
            currentTestStep = testStep;   
            TestStepId = testId;
          }


          function showExpectedResult(testId) {
              const element = document.querySelector('#test-case-content-' + testId);
              const detail = document.querySelector('#test-case-detail-' + testId);
              const expected = document.querySelector('#expected-result-' + testId);
              const container = document.querySelector('.container');

              if (!element.hasAttribute('style') || element.style.display === '') {
                  element.style.display = 'flex';
                  element.style.flexDirection = 'row';
                  element.style.height = '90vh';
                  element.style.transition = 'height 0.5s ease-in-out';

                  detail.style.flex = '0.6 1 0%';
                  detail.style.transition = 'flex 0.3s ease';
                  detail.style.overflowY = 'auto';

                  expected.style.flex = '0.4 1 0%';
                  expected.style.transition = 'flex 0.3s ease';
                  expected.style.display = 'block';
                  expected.style.overflowY = 'auto';

                  setTimeout(() => {
                      container.style.maxHeight = 'calc(100vh - 40px)';
                  }, 50); 
                  
                  const style = 'body { overflow: hidden; } .container { visibility: hidden; } #test-case-content-'+testId+'{ visibility: visible; display: block; position: absolute; top: 40px; left: 0; width: 100%; max-height: 90vh; }';
              } else {
                  container.style.transition = 'max-height 0.5s ease-in-out';
                  element.style.transition = 'height 0.5s ease-in-out';
                  detail.style.transition = 'flex 0.3s ease';

                  container.style.maxHeight = '0';
                  element.style.height = '0';
                  element.style.opacity = '0';
                  detail.style.flex = '0 0 0%';

                  setTimeout(() => {
                      container.removeAttribute('style');
                      element.removeAttribute('style');
                      detail.removeAttribute('style');
                      expected.removeAttribute('style');
                      
                      const style = 'body { overflow: hidden; } .container { visibility: hidden; } #test-case-content-'+testId+'{ visibility: visible; display: block; position: absolute; top: 40px; left: 0; width: 100%; max-height: 90vh; overflow-y: auto;}';
                      document.getElementById('dynamic-style').innerHTML = style;
                  }, 100);
              }
          }


          function highlightLastTestStepIfError(testId) {
            const errorElements = document.querySelectorAll('.test-result-text');
            errorElements.forEach(errorElement => {
                if (errorElement.textContent.trim() === "Error") {
                    const testCaseContent = errorElement.closest('#test-case-content-' + testId);
                    if (testCaseContent) {
                        const testStepContainers = testCaseContent.querySelectorAll('.testStepContainer');
                        if (testStepContainers.length > 0) {
                            const lastTestStepContainer = testStepContainers[testStepContainers.length - 1];
                            const lastTestStep = lastTestStepContainer.querySelector('.testStep');
                            if (lastTestStep) {
                                lastTestStep.style.backgroundColor = '#FF7B67';
                            }
                        }
                    }
                }
            });
          }            
        </script>

     <script>
        const ctx = document.getElementById('overviewChart').getContext('2d');
        const data = [${passedTests}, ${failedTests}, ${skippedTests}];
        const total = data.reduce((a, b) => a + b, 0);
        const percentage = Math.round((data[0] / total) * 100);
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Passed', 'Failed', 'Skipped'],
                datasets: [{
                    data: data,
                    backgroundColor: ['#5AC3B6', '#FF7B67', '#ECE786'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                cutout: '85%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
                }
            },
            plugins: [{
                afterDraw: chart => {
                  const ctx = chart.ctx;
                  ctx.save();

                  const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
                  const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;
                  ctx.font = 'bold 24px Arial';
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillStyle = '#333';
                  ctx.fillText(percentage+'%', centerX, centerY + 15);

                  ctx.font = 'normal 14px Arial';
                  ctx.fillStyle = '#666';
                  ctx.fillText('Completed', centerX, centerY - 10);

                  ctx.restore();
                }
            }]
        });
      </script>
      
    </body>
  </html>`;

  fs.writeFileSync('Test-Result-KTB ().html', html);
}

module.exports = ais_report;