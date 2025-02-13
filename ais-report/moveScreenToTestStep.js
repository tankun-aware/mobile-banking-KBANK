const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const ais_report = require('./reportHTML.js');

function convertToClassName(screenNames) {
  if (Array.isArray(screenNames) && screenNames.length > 0) {
      return screenNames.map(name => 
          `.` + name.split(' ')
              .filter(word => word.trim() !== '')
              .join('.')
      );
  }
  return [];
}

  
async function moveTestScreenshotToDescriptionText() {
    const outputPath = path.resolve('./', 'Test-Result-KTB ().html');
    fs.readFile(outputPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
  
        const $ = cheerio.load(data);
  
        $(`.test-case-content`).each(function () {
            const id = $(this).attr(`id`);
            let screenNames = [];
            
            $(this).find(`#${id} .test-description-container`).each(function () {
                const screenId = $(this).attr(`id`);
                if (screenId) {
                    $('#' + screenId).find(`.test-result-details`).each(function () {
                        $(this).find(`div`).each(function () {
                            const screenName = $(this).attr(`class`);
                            if (screenName && screenNames.indexOf(`.` + screenName) === -1) {
                                screenNames.push(screenName);
                            }
                        });
                    });
                }
            });
            


            let classNameOfscreen = convertToClassName(screenNames);
            let selector = classNameOfscreen.join(`, `);

            $(`#${id}`).find(selector).each(function(i) {
              const testScreenshot = $(this);
              
              const screenshotText = testScreenshot.find(`strong`).text().trim();
  
              if (screenshotText) {
                let matched = false;
  
                $(`#${id} .description-text`).each(function () {
                  const descriptionText = $(this);
                  const descriptionContent = descriptionText
                      .text()
                      .trim()
                      .replace(`0!@#$%^ScreenshotMoveToTestStep^%$#@!0:`, ``)
                      .trim();

                    
                  if (descriptionContent === screenshotText) {
                      descriptionText.empty().append(testScreenshot);
                      matched = true;
                  }
                });
              }
            });
  
            $(`#${id} .test-description-container`).each(function () {
              const screenId = $(this).attr(`id`);
              
              if (screenId) {
                  const testResultDetails = $(this).find(`.test-result-details`);
                  if (!testResultDetails.html().trim()) {
                      $(this).remove();
                  }
              }
            });
        });
  
  
        fs.writeFile(outputPath, $.html(), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
              console.log(`Test report generated at: ${outputPath}`);
            }
            
        });
    });
    
  }

  
module.exports = moveTestScreenshotToDescriptionText;