// https://stackoverflow.com/questions/5292372/how-to-pass-parameters-to-a-script-tag

const script = document.currentScript.getAttribute('name');
const project = document.currentScript.getAttribute('project');

document.currentScript.outerHTML =
  '<iframe id="iframe-' +
  script +
  '"" src="https://backend.m3o.dev/v1/serve?script=' +
  script +
  '&project=' +
  project +
  '"></iframe>';
