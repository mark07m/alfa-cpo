/* Quick DOMPurify SVG attribute preservation test */
const DOMPurify = require('isomorphic-dompurify');

const html = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 12l5 5L20 7" stroke="#000" fill="none" stroke-width="2" stroke-linecap="round" /></svg>';

const options = {
  USE_PROFILES: { html: true, svg: true },
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
  FORBID_ATTR: [],
  ALLOWED_URI_REGEXP: /^(?:(?:https?|ftp|mailto|tel):|\/|#)/i,
  ADD_ATTR: [
    'd',
    'viewBox',
    'viewbox',
    'fill',
    'stroke',
    'stroke-width',
    'stroke-linecap',
    'stroke-linejoin',
    'xmlns',
    'data-slot',
    'focusable',
    'width',
    'height',
    'fill-rule',
    'clip-rule'
  ],
  ALLOWED_TAGS: [
    'a','p','strong','em','ul','ol','li','h1','h2','h3','h4','h5','h6','blockquote','code','pre','hr','br',
    'table','thead','tbody','tr','th','td','img','figure','figcaption','span','div',
    'svg','path','circle','rect','line','polyline','polygon','g'
  ]
};

const out = DOMPurify.sanitize(html, options);
console.log(out);
console.log('has d:', out.includes(' d="') || out.includes(" d='"));
console.log('has viewBox:', out.includes('viewBox='));
console.log('has stroke:', out.includes('stroke='));
console.log('has fill:', out.includes('fill='));


