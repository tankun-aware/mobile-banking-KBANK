const css = `
  <style>
    .description-text {
        white-space: pre-wrap;
        word-wrap: break-word;
        background-color: #f4f4f9;
        color: #333;
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 10px;
        margin: 10px 0;
        overflow: auto;
      }
  
    body {
      font-family: "Roboto", sans-serif;
      font-size: 15px;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }

    h1 {
      background-color: #4CAF50;
      color: white;
      padding: 10px 20px;
      margin: 0;
    }
    h4 {
      text-align: center;
      font-weight: bold;
    }

    #overview {
      margin-top: 80px;
    }

    .custom-navbar {
        background-color: #299688 !important;
    }

    .overviewbutton {
      color: #000000;
      font-weight: bold;
      border: none;
      cursor: pointer;
      font-size: 14px;
    }

    .alltestButton {
      background-color: #299688;
      color: #FFFFFF;
      font-weight: bold;
      border: none;
      cursor: pointer;
      font-size: 14px;
    }

    .overviewbutton:hover {
      background-color: #D3D3D3;
    }

    .alltestButton:hover {
      background-color: #4CB59F;
    }
    
    .graph {
      width: 260px;
      height: 260px;
      margin: auto; 
      border: none;
    }

    .message-box p {
      display: flex;
      align-items: center;
    }

    .message-box p strong {
      width: 250px;
    }

    .filter-bar {
      background-color: #FFFFFF;
      font-size: 14px;
    }
  
    .filter-test-name {
      font-weight: bold;
      background-color: #D5DEEF;
      font-size: 14px;
    }
    .filter-status, .filter-describe {
      font-weight: bold;
      font-size: 14px;
    }

    .search-button-filter {
      font-weight: bold;
      padding: 8px 15px;
      font-size: 14px;
      background-color: #299688;
      color: white;
      border: none;
      border-radius: 4px;
      transition: background-color 0.5s ease;
      width: 200px;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .loading-spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .search-button-filter.loading {
      background-color: #ddd;
      pointer-events: none;
    }

    .search-button-filter:hover {
      background-color: #4CB59F;
    }

    .filter-bar select, .filter-bar input {
      box-sizing: border-box;
    }

    .test-scenario {
      background-color: #FFFFFF;
    }

    .test-case {
      background-color: #F1F4FB;
    }

    .all-test h4 {
      font-size: 18px;
    }

    .test-case-title-container .duration {
      font-size: 13px;
    }

    .test-case-title-container .test-duration-icon {
      font-size: 18px;
      color: #00000061;
    }

    .test-case-title {
      font-size: 13px;
      color: #000000;
    }

    .test-icon {
      font-size: 30px;
    }

    .test-pass {
      color: #9FC280;
    }

    .test-skip {
      color: #ECE786;
    }

    .test-fail {
      color: #FF7B67;
    }

    .test-case-detail .test-case-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        margin: 35px auto;
        color: #333;
        max-width: 1000px;
    }

    .test-description-container {
        border-top: 1px solid #ccc;
    }

    #test-step-header {
      background-color: #299688;
      color: #FFFFFF;
    }

    #test-step-header .test-result-icon{
      color: #FFFFFF;
    }

    .test-case-detail .test-result-header {
        display: inline-flex !important;
        align-items: center;
        justify-content: flex-start;
        cursor: pointer;
        background-color: #BFF8E9;
        padding: 8px 12px;
        border-bottom: 1px solid #ccc;
        font-size: 14px;
        font-weight: bold;
        width: 100%;
        box-sizing: border-box;
    }

    .test-result-header:hover {
        background-color: #ddd;
    }

    .test-result-icon {
        font-size: 18px;
        margin-right: 8px;
        color: #666;
    }

    .test-result-text {
        margin: 0;
        text-align: left;
    }

    .test-result-details {
        display: block;
        padding: 10px;
        background-color: #FFFFFF;
        border: 1px solid #ccc;
        border-radius: 0 0 5px 5px;
        font-size: 14px;
        margin: 0;
    }

    .test-result-details.hidden {
        display: none !important;
    }

    .test-result-container {
        max-width: 1000px;
        margin: 20px auto;
        border: 1px solid #ccc;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 10px auto;
    }

    .description-text {
      background-color: #F1F4FB;
      padding: 8px;
    }
    
    .test-case-detail {
      position: relative;
    }

    .test-case-detail .duration {
      position: absolute;
      top: 10px;
      right: 0;
      margin: 0;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 14px;
      color: #333;
      text-align: right;
      align-items: center;
      display: flex;
      padding-left: 30px; 
    }

    .test-case-detail .duration .test-duration-icon {
      position: absolute;
      font-size: 18px;
      color: #00000061;
      left: 5px; 
    }

    .scroll-to-testSteps {
        cursor: pointer;
        position: fixed;
        bottom: 10px;
        left: 10px;
        z-index: 1000;
    }

    .scroll-top {
        display: inline-block;
        padding: 5px 10px;
        background-color: #f0f0f0;
        color: #000000;
        border: 1px solid #ccc;
        border-radius: 4px;
        text-decoration: none;
        font-size: 12px;
        transition: background-color 0.3s;
    }

    .scroll-top:hover {
        background-color: #e0e0e0;
        color: #000;
        border-color: #bbb;
    }

    .testStep {
      cursor: pointer;
      padding: 10px 20px;
      background-color: #f0f0f0;
      border: 1px solid #ccc;
      border-radius: 5px;
      color: #333;
      font-weight: bold;
      text-align: left;
      transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
      flex-grow: 1; 
      min-width: 120px;
      white-space: normal;
      overflow: hidden;
      text-overflow: ellipsis; 
    }

    .testStep:hover {
      background-color: #e0e0e0;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .testStep:active {
      transform: scale(0.98);
      background-color: #d0d0d0;
      box-shadow: none;
    }

    .testStepRow button {
      flex: 0 0 20%;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      background-color: #299688;
      color: #FFFFFF;
      border: 0px;
      border-radius: 5px;
      transition: background-color 0.3s ease;
      margin-left: 10px;
    }

    .testStepRow button:hover {
      background-color: #4CB59F;
    }

    .expected-result {
      display:none;
      white-space: normal;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }   
      
    .token.operator {
      background: none !important;
    }
    
    pre {
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }

    h5 {
      text-align: center;
    }

    .result-not-found {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      font-size: 18px;
      font-weight: bold;
    }        
  </style>

  <style id="dynamic-style">
    .overview * {
      display: none;
    } 
    .all-test {
      display: block;
    } 
    .all-test .test-case-content .test-case-detail {
      display: none;
    }
  </style>
`
module.exports = { css };