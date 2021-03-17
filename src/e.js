const script = document.currentScript.getAttribute('script');
const project = document.currentScript.getAttribute('project');

document.currentScript.outerHTML =
  '<iframe id="iframe-' +
  script +
  '"" src="https://backend.m3o.dev/v1/serve?script=' +
  script +
  '&project=' +
  project +
  '"></iframe>';
