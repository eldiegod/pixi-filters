/*!
 * pixi-filters - v2.2.0
 * Compiled Wed, 18 Oct 2017 20:54:29 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.__pixi_filters = {})));
}(this, (function (exports) { 'use strict';

if (typeof PIXI === 'undefined' || typeof PIXI.filters === 'undefined') { throw 'PixiJS is required'; }

/*!
 * @pixi/filter-ascii - v2.1.0
 * Compiled Wed, 18 Oct 2017 20:51:32 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment="varying vec2 vTextureCoord;\n\nuniform vec4 filterArea;\nuniform float pixelSize;\nuniform sampler2D uSampler;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n    return floor( coord / size ) * size;\n}\n\nvec2 getMod(vec2 coord, vec2 size)\n{\n    return mod( coord , size) / size;\n}\n\nfloat character(float n, vec2 p)\n{\n    p = floor(p*vec2(4.0, -4.0) + 2.5);\n    if (clamp(p.x, 0.0, 4.0) == p.x && clamp(p.y, 0.0, 4.0) == p.y)\n    {\n        if (int(mod(n/exp2(p.x + 5.0*p.y), 2.0)) == 1) return 1.0;\n    }\n    return 0.0;\n}\n\nvoid main()\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    // get the rounded color..\n    vec2 pixCoord = pixelate(coord, vec2(pixelSize));\n    pixCoord = unmapCoord(pixCoord);\n\n    vec4 color = texture2D(uSampler, pixCoord);\n\n    // determine the character to use\n    float gray = (color.r + color.g + color.b) / 3.0;\n\n    float n =  65536.0;             // .\n    if (gray > 0.2) n = 65600.0;    // :\n    if (gray > 0.3) n = 332772.0;   // *\n    if (gray > 0.4) n = 15255086.0; // o\n    if (gray > 0.5) n = 23385164.0; // &\n    if (gray > 0.6) n = 15252014.0; // 8\n    if (gray > 0.7) n = 13199452.0; // @\n    if (gray > 0.8) n = 11512810.0; // #\n\n    // get the mod..\n    vec2 modd = getMod(coord, vec2(pixelSize));\n\n    gl_FragColor = color * character( n, vec2(-1.0) + modd * 2.0);\n\n}";
var AsciiFilter=function(e){function n(n){void 0===n&&(n=8),e.call(this,vertex,fragment),this.size=n;}e&&(n.__proto__=e),(n.prototype=Object.create(e&&e.prototype)).constructor=n;var r={size:{}};return r.size.get=function(){return this.uniforms.pixelSize},r.size.set=function(e){this.uniforms.pixelSize=e;},Object.defineProperties(n.prototype,r),n}(PIXI.Filter);PIXI.filters.AsciiFilter=AsciiFilter;

/*!
 * @pixi/filter-advanced-bloom - v2.2.0
 * Compiled Wed, 18 Oct 2017 20:54:27 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$1="\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main() {\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";
var fragment$1="\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform float threshold;\n\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    // A simple & fast algorithm for getting brightness.\n    // It's inaccuracy , but good enought for this feature.\n    float _max = max(max(color.r, color.g), color.b);\n    float _min = min(min(color.r, color.g), color.b);\n    float brightness = (_max + _min) * 0.5;\n\n    if(brightness > threshold) {\n        gl_FragColor = color;\n    } else {\n        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n    }\n}\n";
var ExtractBrightnessFilter=function(r){function t(t){void 0===t&&(t=.5),r.call(this,vertex$1,fragment$1),this.threshold=t;}r&&(t.__proto__=r),(t.prototype=Object.create(r&&r.prototype)).constructor=t;var e={threshold:{}};return e.threshold.get=function(){return this.uniforms.threshold},e.threshold.set=function(r){this.uniforms.threshold=r;},Object.defineProperties(t.prototype,e),t}(PIXI.Filter);
var vertex$1$1="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main() {\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";
var fragment$1$1="uniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D bloomTexture;\nuniform float bloomScale;\nuniform float brightness;\n\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    color.rgb *= brightness;\n    vec4 bloomColor = vec4(texture2D(bloomTexture, vTextureCoord).rgb, 0.0);\n    bloomColor.rgb *= bloomScale;\n    gl_FragColor = color + bloomColor;\n}\n";
var AdvancedBloomFilter=function(r){function t(t){r.call(this,vertex$1$1,fragment$1$1),"number"==typeof t&&(t={threshold:t}),t=Object.assign({threshold:.5,bloomScale:1,brightness:1,blur:8,quality:4,resolution:PIXI.settings.RESOLUTION,kernelSize:5},t),this.bloomScale=t.bloomScale,this.brightness=t.brightness;var e=t.blur,o=t.quality,n=t.resolution,i=t.kernelSize,l=PIXI.filters,s=l.BlurXFilter,a=l.BlurYFilter;this._extract=new ExtractBrightnessFilter(t.threshold),this._blurX=new s(e,o,n,i),this._blurY=new a(e,o,n,i);}r&&(t.__proto__=r),(t.prototype=Object.create(r&&r.prototype)).constructor=t;var e={threshold:{},blur:{}};return t.prototype.apply=function(r,t,e,o,n){var i=r.getRenderTarget(!0);this._extract.apply(r,t,i,!0,n),this._blurX.apply(r,i,i,!0,n),this._blurY.apply(r,i,i,!0,n),this.uniforms.bloomScale=this.bloomScale,this.uniforms.brightness=this.brightness,this.uniforms.bloomTexture=i,r.applyFilter(this,t,e,o),r.returnRenderTarget(i);},e.threshold.get=function(){return this._extract.threshold},e.threshold.set=function(r){this._extract.threshold=r;},e.blur.get=function(){return this._blurX.blur},e.blur.set=function(r){this._blurX.blur=this._blurY.blur=r;},Object.defineProperties(t.prototype,e),t}(PIXI.Filter);PIXI.filters.AdvancedBloomFilter=AdvancedBloomFilter;

/*!
 * @pixi/filter-bloom - v2.1.0
 * Compiled Wed, 18 Oct 2017 20:51:32 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var ref=PIXI.filters;
var BlurXFilter=ref.BlurXFilter;
var BlurYFilter=ref.BlurYFilter;
var VoidFilter=ref.VoidFilter;
var BloomFilter=function(r){function t(t,l,e,i){void 0===t&&(t=2),void 0===l&&(l=4),void 0===e&&(e=PIXI.settings.RESOLUTION),void 0===i&&(i=5),r.call(this);var u,o;"number"==typeof t?(u=t,o=t):t instanceof PIXI.Point?(u=t.x,o=t.y):Array.isArray(t)&&(u=t[0],o=t[1]),this.blurXFilter=new BlurXFilter(u,l,e,i),this.blurYFilter=new BlurYFilter(o,l,e,i),this.blurYFilter.blendMode=PIXI.BLEND_MODES.SCREEN,this.defaultFilter=new VoidFilter;}r&&(t.__proto__=r),(t.prototype=Object.create(r&&r.prototype)).constructor=t;var l={blur:{},blurX:{},blurY:{}};return t.prototype.apply=function(r,t,l){var e=r.getRenderTarget(!0);this.defaultFilter.apply(r,t,l),this.blurXFilter.apply(r,t,e),this.blurYFilter.apply(r,e,l),r.returnRenderTarget(e);},l.blur.get=function(){return this.blurXFilter.blur},l.blur.set=function(r){this.blurXFilter.blur=this.blurYFilter.blur=r;},l.blurX.get=function(){return this.blurXFilter.blur},l.blurX.set=function(r){this.blurXFilter.blur=r;},l.blurY.get=function(){return this.blurYFilter.blur},l.blurY.set=function(r){this.blurYFilter.blur=r;},Object.defineProperties(t.prototype,l),t}(PIXI.Filter);PIXI.filters.BloomFilter=BloomFilter;

/*!
 * @pixi/filter-bulge-pinch - v2.1.0
 * Compiled Wed, 18 Oct 2017 20:51:32 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$2="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";
var fragment$2="uniform float radius;\nuniform float strength;\nuniform vec2 center;\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\n\nvoid main()\n{\n    vec2 coord = vTextureCoord * filterArea.xy;\n    coord -= center * dimensions.xy;\n    float distance = length(coord);\n    if (distance < radius) {\n        float percent = distance / radius;\n        if (strength > 0.0) {\n            coord *= mix(1.0, smoothstep(0.0, radius / distance, percent), strength * 0.75);\n        } else {\n            coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);\n        }\n    }\n    coord += center * dimensions.xy;\n    coord /= filterArea.xy;\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    gl_FragColor = texture2D(uSampler, clampedCoord);\n    if (coord != clampedCoord) {\n        gl_FragColor *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n}\n";
var BulgePinchFilter=function(e){function r(r,t,n){e.call(this,vertex$2,fragment$2),this.center=r||[.5,.5],this.radius=t||100,this.strength=n||1;}e&&(r.__proto__=e),(r.prototype=Object.create(e&&e.prototype)).constructor=r;var t={radius:{},strength:{},center:{}};return r.prototype.apply=function(e,r,t){this.uniforms.dimensions[0]=r.sourceFrame.width,this.uniforms.dimensions[1]=r.sourceFrame.height,e.applyFilter(this,r,t);},t.radius.get=function(){return this.uniforms.radius},t.radius.set=function(e){this.uniforms.radius=e;},t.strength.get=function(){return this.uniforms.strength},t.strength.set=function(e){this.uniforms.strength=e;},t.center.get=function(){return this.uniforms.center},t.center.set=function(e){this.uniforms.center=e;},Object.defineProperties(r.prototype,t),r}(PIXI.Filter);PIXI.filters.BulgePinchFilter=BulgePinchFilter;

/*!
 * @pixi/filter-color-replace - v2.1.0
 * Compiled Wed, 18 Oct 2017 20:51:35 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$3="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";
var fragment$3="varying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform vec3 originalColor;\nuniform vec3 newColor;\nuniform float epsilon;\nvoid main(void) {\n    vec4 currentColor = texture2D(texture, vTextureCoord);\n    vec3 colorDiff = originalColor - (currentColor.rgb / max(currentColor.a, 0.0000000001));\n    float colorDistance = length(colorDiff);\n    float doReplace = step(colorDistance, epsilon);\n    gl_FragColor = vec4(mix(currentColor.rgb, (newColor + colorDiff) * currentColor.a, doReplace), currentColor.a);\n}\n";
var ColorReplaceFilter=function(o){function r(r,e,n){void 0===r&&(r=16711680),void 0===e&&(e=0),void 0===n&&(n=.4),o.call(this,vertex$3,fragment$3),this.originalColor=r,this.newColor=e,this.epsilon=n;}o&&(r.__proto__=o),(r.prototype=Object.create(o&&o.prototype)).constructor=r;var e={originalColor:{},newColor:{},epsilon:{}};return e.originalColor.set=function(o){var r=this.uniforms.originalColor;"number"==typeof o?(PIXI.utils.hex2rgb(o,r),this._originalColor=o):(r[0]=o[0],r[1]=o[1],r[2]=o[2],this._originalColor=PIXI.utils.rgb2hex(r));},e.originalColor.get=function(){return this._originalColor},e.newColor.set=function(o){var r=this.uniforms.newColor;"number"==typeof o?(PIXI.utils.hex2rgb(o,r),this._newColor=o):(r[0]=o[0],r[1]=o[1],r[2]=o[2],this._newColor=PIXI.utils.rgb2hex(r));},e.newColor.get=function(){return this._newColor},e.epsilon.set=function(o){this.uniforms.epsilon=o;},e.epsilon.get=function(){return this.uniforms.epsilon},Object.defineProperties(r.prototype,e),r}(PIXI.Filter);PIXI.filters.ColorReplaceFilter=ColorReplaceFilter;

/*!
 * @pixi/filter-convolution - v2.1.0
 * Compiled Wed, 18 Oct 2017 20:51:35 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$4="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$4="precision mediump float;\n\nvarying mediump vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec2 texelSize;\nuniform float matrix[9];\n\nvoid main(void)\n{\n   vec4 c11 = texture2D(uSampler, vTextureCoord - texelSize); // top left\n   vec4 c12 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - texelSize.y)); // top center\n   vec4 c13 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y - texelSize.y)); // top right\n\n   vec4 c21 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y)); // mid left\n   vec4 c22 = texture2D(uSampler, vTextureCoord); // mid center\n   vec4 c23 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y)); // mid right\n\n   vec4 c31 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y + texelSize.y)); // bottom left\n   vec4 c32 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + texelSize.y)); // bottom center\n   vec4 c33 = texture2D(uSampler, vTextureCoord + texelSize); // bottom right\n\n   gl_FragColor =\n       c11 * matrix[0] + c12 * matrix[1] + c13 * matrix[2] +\n       c21 * matrix[3] + c22 * matrix[4] + c23 * matrix[5] +\n       c31 * matrix[6] + c32 * matrix[7] + c33 * matrix[8];\n\n   gl_FragColor.a = c22.a;\n}\n";
var ConvolutionFilter=function(e){function t(t,r,o){e.call(this,vertex$4,fragment$4),this.matrix=t,this.width=r,this.height=o;}e&&(t.__proto__=e),(t.prototype=Object.create(e&&e.prototype)).constructor=t;var r={matrix:{},width:{},height:{}};return r.matrix.get=function(){return this.uniforms.matrix},r.matrix.set=function(e){this.uniforms.matrix=new Float32Array(e);},r.width.get=function(){return 1/this.uniforms.texelSize[0]},r.width.set=function(e){this.uniforms.texelSize[0]=1/e;},r.height.get=function(){return 1/this.uniforms.texelSize[1]},r.height.set=function(e){this.uniforms.texelSize[1]=1/e;},Object.defineProperties(t.prototype,r),t}(PIXI.Filter);PIXI.filters.ConvolutionFilter=ConvolutionFilter;

/*!
 * @pixi/filter-cross-hatch - v2.1.0
 * Compiled Wed, 18 Oct 2017 20:51:35 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$5="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$5="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    float lum = length(texture2D(uSampler, vTextureCoord.xy).rgb);\n\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\n    if (lum < 1.00)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.75)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.50)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.3)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n}\n";
var CrossHatchFilter=function(r){function o(){r.call(this,vertex$5,fragment$5);}return r&&(o.__proto__=r),o.prototype=Object.create(r&&r.prototype),o.prototype.constructor=o,o}(PIXI.Filter);PIXI.filters.CrossHatchFilter=CrossHatchFilter;

/*!
 * @pixi/filter-dot - v2.1.0
 * Compiled Wed, 18 Oct 2017 20:51:35 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$6="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$6="precision mediump float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;\n\nuniform float angle;\nuniform float scale;\n\nfloat pattern()\n{\n   float s = sin(angle), c = cos(angle);\n   vec2 tex = vTextureCoord * filterArea.xy;\n   vec2 point = vec2(\n       c * tex.x - s * tex.y,\n       s * tex.x + c * tex.y\n   ) * scale;\n   return (sin(point.x) * sin(point.y)) * 4.0;\n}\n\nvoid main()\n{\n   vec4 color = texture2D(uSampler, vTextureCoord);\n   float average = (color.r + color.g + color.b) / 3.0;\n   gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);\n}\n";
var DotFilter=function(e){function n(n,t){void 0===n&&(n=1),void 0===t&&(t=5),e.call(this,vertex$6,fragment$6),this.scale=n,this.angle=t;}e&&(n.__proto__=e),(n.prototype=Object.create(e&&e.prototype)).constructor=n;var t={scale:{},angle:{}};return t.scale.get=function(){return this.uniforms.scale},t.scale.set=function(e){this.uniforms.scale=e;},t.angle.get=function(){return this.uniforms.angle},t.angle.set=function(e){this.uniforms.angle=e;},Object.defineProperties(n.prototype,t),n}(PIXI.Filter);PIXI.filters.DotFilter=DotFilter;

/*!
 * @pixi/filter-drop-shadow - v2.1.0
 * Compiled Wed, 18 Oct 2017 20:51:38 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$7="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$7="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float alpha;\nuniform vec3 color;\nvoid main(void){\n    vec4 sample = texture2D(uSampler, vTextureCoord);\n\n    // Un-premultiply alpha before applying the color\n    if (sample.a > 0.0) {\n        sample.rgb /= sample.a;\n    }\n\n    // Premultiply alpha again\n    sample.rgb = color.rgb * sample.a;\n\n    // alpha user alpha\n    sample *= alpha;\n\n    gl_FragColor = sample;\n}";
var DropShadowFilter=function(t){function r(r,e,i,n,o){void 0===r&&(r=45),void 0===e&&(e=5),void 0===i&&(i=2),void 0===n&&(n=0),void 0===o&&(o=.5),t.call(this),this.tintFilter=new PIXI.Filter(vertex$7,fragment$7),this.blurFilter=new PIXI.filters.BlurFilter,this.blurFilter.blur=i,this.rotation=r,this.padding=e,this.distance=e,this.alpha=o,this.color=n;}t&&(r.__proto__=t),(r.prototype=Object.create(t&&t.prototype)).constructor=r;var e={distance:{},rotation:{},blur:{},alpha:{},color:{}};return r.prototype.apply=function(r,e,i){var n=r.getRenderTarget();n.transform=new PIXI.Matrix,n.transform.translate(this.distance*Math.cos(this.angle),this.distance*Math.sin(this.angle)),this.tintFilter.apply(r,e,n,!0),this.blurFilter.apply(r,n,i),t.prototype.apply.call(this,r,e,i),n.transform=null,r.returnRenderTarget(n);},r.prototype.updatePadding=function(){this.padding=this.distance+2*this.blur;},e.distance.get=function(){return this._distance},e.distance.set=function(t){this._distance=t,this.updatePadding();},e.rotation.get=function(){return this.angle/PIXI.DEG_TO_RAD},e.rotation.set=function(t){this.angle=t*PIXI.DEG_TO_RAD;},e.blur.get=function(){return this.blurFilter.blur},e.blur.set=function(t){this.blurFilter.blur=t,this.updatePadding();},e.alpha.get=function(){return this.tintFilter.uniforms.alpha},e.alpha.set=function(t){this.tintFilter.uniforms.alpha=t;},e.color.get=function(){return PIXI.utils.rgb2hex(this.tintFilter.uniforms.color)},e.color.set=function(t){PIXI.utils.hex2rgb(t,this.tintFilter.uniforms.color);},Object.defineProperties(r.prototype,e),r}(PIXI.Filter);PIXI.filters.DropShadowFilter=DropShadowFilter;

/*!
 * @pixi/filter-emboss - v2.1.0
 * Compiled Wed, 18 Oct 2017 20:51:38 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$8="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$8="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float strength;\nuniform vec4 filterArea;\n\n\nvoid main(void)\n{\n\tvec2 onePixel = vec2(1.0 / filterArea);\n\n\tvec4 color;\n\n\tcolor.rgb = vec3(0.5);\n\n\tcolor -= texture2D(uSampler, vTextureCoord - onePixel) * strength;\n\tcolor += texture2D(uSampler, vTextureCoord + onePixel) * strength;\n\n\tcolor.rgb = vec3((color.r + color.g + color.b) / 3.0);\n\n\tfloat alpha = texture2D(uSampler, vTextureCoord).a;\n\n\tgl_FragColor = vec4(color.rgb * alpha, alpha);\n}\n";
var EmbossFilter=function(e){function t(t){void 0===t&&(t=5),e.call(this,vertex$8,fragment$8),this.strength=t;}e&&(t.__proto__=e),(t.prototype=Object.create(e&&e.prototype)).constructor=t;var r={strength:{}};return r.strength.get=function(){return this.uniforms.strength},r.strength.set=function(e){this.uniforms.strength=e;},Object.defineProperties(t.prototype,r),t}(PIXI.Filter);PIXI.filters.EmbossFilter=EmbossFilter;

/*!
 * @pixi/filter-glow - v2.1.0
 * Compiled Wed, 18 Oct 2017 20:51:38 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$9="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";
var fragment$9="varying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nuniform float distance;\nuniform float outerStrength;\nuniform float innerStrength;\nuniform vec4 glowColor;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nvec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n\nvoid main(void) {\n    const float PI = 3.14159265358979323846264;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float totalAlpha = 0.0;\n    float maxTotalAlpha = 0.0;\n    float cosAngle;\n    float sinAngle;\n    vec2 displaced;\n    for (float angle = 0.0; angle <= PI * 2.0; angle += %QUALITY_DIST%) {\n       cosAngle = cos(angle);\n       sinAngle = sin(angle);\n       for (float curDistance = 1.0; curDistance <= %DIST%; curDistance++) {\n           displaced.x = vTextureCoord.x + cosAngle * curDistance * px.x;\n           displaced.y = vTextureCoord.y + sinAngle * curDistance * px.y;\n           curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n           totalAlpha += (distance - curDistance) * curColor.a;\n           maxTotalAlpha += (distance - curDistance);\n       }\n    }\n    maxTotalAlpha = max(maxTotalAlpha, 0.0001);\n\n    ownColor.a = max(ownColor.a, 0.0001);\n    ownColor.rgb = ownColor.rgb / ownColor.a;\n    float outerGlowAlpha = (totalAlpha / maxTotalAlpha)  * outerStrength * (1. - ownColor.a);\n    float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * innerStrength * ownColor.a;\n    float resultAlpha = (ownColor.a + outerGlowAlpha);\n    gl_FragColor = vec4(mix(mix(ownColor.rgb, glowColor.rgb, innerGlowAlpha / ownColor.a), glowColor.rgb, outerGlowAlpha / resultAlpha) * resultAlpha, resultAlpha);\n}\n";
var GlowFilter=function(o){function t(t,n,r,e,l){void 0===t&&(t=10),void 0===n&&(n=4),void 0===r&&(r=0),void 0===e&&(e=16777215),void 0===l&&(l=.1),o.call(this,vertex$9,fragment$9.replace(/%QUALITY_DIST%/gi,""+(1/l/t).toFixed(7)).replace(/%DIST%/gi,""+t.toFixed(7))),this.uniforms.glowColor=new Float32Array([0,0,0,1]),this.distance=t,this.color=e,this.outerStrength=n,this.innerStrength=r;}o&&(t.__proto__=o),(t.prototype=Object.create(o&&o.prototype)).constructor=t;var n={color:{},distance:{},outerStrength:{},innerStrength:{}};return n.color.get=function(){return PIXI.utils.rgb2hex(this.uniforms.glowColor)},n.color.set=function(o){PIXI.utils.hex2rgb(o,this.uniforms.glowColor);},n.distance.get=function(){return this.uniforms.distance},n.distance.set=function(o){this.uniforms.distance=o;},n.outerStrength.get=function(){return this.uniforms.outerStrength},n.outerStrength.set=function(o){this.uniforms.outerStrength=o;},n.innerStrength.get=function(){return this.uniforms.innerStrength},n.innerStrength.set=function(o){this.uniforms.innerStrength=o;},Object.defineProperties(t.prototype,n),t}(PIXI.Filter);PIXI.filters.GlowFilter=GlowFilter;

/*!
 * @pixi/filter-godray - v2.1.0
 * Compiled Wed, 18 Oct 2017 20:51:38 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$10="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var perlin="vec3 mod289(vec3 x)\n{\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 mod289(vec4 x)\n{\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 permute(vec4 x)\n{\n    return mod289(((x * 34.0) + 1.0) * x);\n}\nvec4 taylorInvSqrt(vec4 r)\n{\n    return 1.79284291400159 - 0.85373472095314 * r;\n}\nvec3 fade(vec3 t)\n{\n    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);\n}\n// Classic Perlin noise, periodic variant\nfloat pnoise(vec3 P, vec3 rep)\n{\n    vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period\n    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period\n    Pi0 = mod289(Pi0);\n    Pi1 = mod289(Pi1);\n    vec3 Pf0 = fract(P); // Fractional part for interpolation\n    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n    vec4 iy = vec4(Pi0.yy, Pi1.yy);\n    vec4 iz0 = Pi0.zzzz;\n    vec4 iz1 = Pi1.zzzz;\n    vec4 ixy = permute(permute(ix) + iy);\n    vec4 ixy0 = permute(ixy + iz0);\n    vec4 ixy1 = permute(ixy + iz1);\n    vec4 gx0 = ixy0 * (1.0 / 7.0);\n    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n    gx0 = fract(gx0);\n    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n    vec4 sz0 = step(gz0, vec4(0.0));\n    gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n    gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n    vec4 gx1 = ixy1 * (1.0 / 7.0);\n    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n    gx1 = fract(gx1);\n    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n    vec4 sz1 = step(gz1, vec4(0.0));\n    gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n    gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);\n    vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);\n    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);\n    vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);\n    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);\n    vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);\n    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);\n    vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);\n    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n    g000 *= norm0.x;\n    g010 *= norm0.y;\n    g100 *= norm0.z;\n    g110 *= norm0.w;\n    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n    g001 *= norm1.x;\n    g011 *= norm1.y;\n    g101 *= norm1.z;\n    g111 *= norm1.w;\n    float n000 = dot(g000, Pf0);\n    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n    float n111 = dot(g111, Pf1);\n    vec3 fade_xyz = fade(Pf0);\n    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n    return 2.2 * n_xyz;\n}\nfloat turb(vec3 P, vec3 rep, float lacunarity, float gain)\n{\n    float sum = 0.0;\n    float sc = 1.0;\n    float totalgain = 1.0;\n    for (float i = 0.0; i < 6.0; i++)\n    {\n        sum += totalgain * pnoise(P * sc, rep);\n        sc *= lacunarity;\n        totalgain *= gain;\n    }\n    return abs(sum);\n}\n";
var main="varying vec2 vTextureCoord;\nuniform float time;\nuniform vec2 angleDir;\nuniform float gain;\nuniform float lacunarity;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\n$perlin\n\nvoid main(void) {\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n    vec2 coord = vTextureCoord * vec2(filterArea.x / dimensions.x, filterArea.y / dimensions.y);\n    float xx = angleDir.x;\n    float yy = angleDir.y;\n    vec3 dir = vec3((xx * coord.x) + (yy * coord.y), (xx * coord.x) + (yy * coord.y), 0.0);\n    float noise = turb(dir + vec3(time, 0.0, 62.1 + time), vec3(480.0, 320.0, 480.0), lacunarity, gain);\n    noise = mix(noise, 0.0, 0.3);\n    //fade vertically.\n    vec4 mist = vec4(noise, noise, noise, 1.0) * (1.0 - coord.y);\n    mist.a = 1.0;\n    gl_FragColor += mist;\n}";
var GodrayFilter=function(n){function e(e,t,i,r){void 0===e&&(e=30),void 0===t&&(t=.5),void 0===i&&(i=2.5),void 0===r&&(r=0),n.call(this,vertex$10,main.replace("$perlin",perlin)),this.angle=e,this.gain=t,this.lacunarity=i,this.time=r;}n&&(e.__proto__=n),(e.prototype=Object.create(n&&n.prototype)).constructor=e;var t={time:{},gain:{},lacunarity:{}};return e.prototype.apply=function(n,e,t,i){this.uniforms.dimensions[0]=e.sourceFrame.width,this.uniforms.dimensions[1]=e.sourceFrame.height;var r=this.angle*PIXI.DEG_TO_RAD,o=Math.cos(r)*e.sourceFrame.width,a=Math.sin(r)*e.sourceFrame.height,c=Math.sqrt(o*o+a*a),g=this.uniforms.angleDir;g[0]=o/c,g[1]=a/c,n.applyFilter(this,e,t,i);},t.time.get=function(){return this.uniforms.time},t.time.set=function(n){this.uniforms.time=n;},t.gain.get=function(){return this.uniforms.gain},t.gain.set=function(n){this.uniforms.gain=n;},t.lacunarity.get=function(){return this.uniforms.lacunarity},t.lacunarity.set=function(n){this.uniforms.lacunarity=n;},Object.defineProperties(e.prototype,t),e}(PIXI.Filter);PIXI.filters.GodrayFilter=GodrayFilter;

/*!
 * @pixi/filter-outline - v2.1.0
 * Compiled Wed, 18 Oct 2017 20:51:42 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$11="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";
var fragment$10="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float thickness;\nuniform vec4 outlineColor;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nvec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n\nvoid main(void) {\n    const float PI = 3.14159265358979323846264;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float maxAlpha = 0.;\n    vec2 displaced;\n    for (float angle = 0.; angle < PI * 2.; angle += %THICKNESS% ) {\n        displaced.x = vTextureCoord.x + thickness * px.x * cos(angle);\n        displaced.y = vTextureCoord.y + thickness * px.y * sin(angle);\n        curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n        maxAlpha = max(maxAlpha, curColor.a);\n    }\n    float resultAlpha = max(maxAlpha, ownColor.a);\n    gl_FragColor = vec4((ownColor.rgb + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);\n}\n";
var OutlineFilter=function(e){function o(o,r){void 0===o&&(o=1),void 0===r&&(r=0),e.call(this,vertex$11,fragment$10.replace(/%THICKNESS%/gi,(1/o).toFixed(7))),this.thickness=o,this.uniforms.outlineColor=new Float32Array([0,0,0,1]),this.color=r;}e&&(o.__proto__=e),(o.prototype=Object.create(e&&e.prototype)).constructor=o;var r={color:{},thickness:{}};return r.color.get=function(){return PIXI.utils.rgb2hex(this.uniforms.outlineColor)},r.color.set=function(e){PIXI.utils.hex2rgb(e,this.uniforms.outlineColor);},r.thickness.get=function(){return this.uniforms.thickness},r.thickness.set=function(e){this.uniforms.thickness=e;},Object.defineProperties(o.prototype,r),o}(PIXI.Filter);PIXI.filters.OutlineFilter=OutlineFilter;

/*!
 * @pixi/filter-multi-color-replace - v2.1.0
 * Compiled Wed, 18 Oct 2017 20:51:42 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$12="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";
var fragment$11="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float epsilon;\n\nconst int MAX_COLORS = %maxColors%;\n\nuniform vec3 originalColors[MAX_COLORS];\nuniform vec3 targetColors[MAX_COLORS];\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n\n    float alpha = gl_FragColor.a;\n    if (alpha < 0.0001)\n    {\n      return;\n    }\n\n    vec3 color = gl_FragColor.rgb / alpha;\n\n    for(int i = 0; i < MAX_COLORS; i++)\n    {\n      vec3 origColor = originalColors[i];\n      if (origColor.r < 0.0)\n      {\n        break;\n      }\n      vec3 colorDiff = origColor - color;\n      if (length(colorDiff) < epsilon)\n      {\n        vec3 targetColor = targetColors[i];\n        gl_FragColor = vec4((targetColor + colorDiff) * alpha, alpha);\n        return;\n      }\n    }\n}\n";
var MultiColorReplaceFilter=function(o){function r(r,e,t){void 0===e&&(e=.05),void 0===t&&(t=null),t=t||r.length,o.call(this,vertex$12,fragment$11.replace(/%maxColors%/g,t)),this.epsilon=e,this._maxColors=t,this._replacements=null,this.uniforms.originalColors=new Float32Array(3*t),this.uniforms.targetColors=new Float32Array(3*t),this.replacements=r;}o&&(r.__proto__=o),(r.prototype=Object.create(o&&o.prototype)).constructor=r;var e={replacements:{},maxColors:{},epsilon:{}};return e.replacements.set=function(o){var r=this.uniforms.originalColors,e=this.uniforms.targetColors,t=o.length;if(t>this._maxColors){ throw"Length of replacements ("+t+") exceeds the maximum colors length ("+this._maxColors+")"; }r[3*t]=-1;for(var n=0;n<t;n++){var i=o[n],l=i[0];"number"==typeof l?l=PIXI.utils.hex2rgb(l):i[0]=PIXI.utils.rgb2hex(l),r[3*n]=l[0],r[3*n+1]=l[1],r[3*n+2]=l[2];var a=i[1];"number"==typeof a?a=PIXI.utils.hex2rgb(a):i[1]=PIXI.utils.rgb2hex(a),e[3*n]=a[0],e[3*n+1]=a[1],e[3*n+2]=a[2];}this._replacements=o;},e.replacements.get=function(){return this._replacements},r.prototype.refresh=function(){this.replacements=this._replacements;},e.maxColors.get=function(){return this._maxColors},e.epsilon.set=function(o){this.uniforms.epsilon=o;},e.epsilon.get=function(){return this.uniforms.epsilon},Object.defineProperties(r.prototype,e),r}(PIXI.Filter);PIXI.filters.MultiColorReplaceFilter=MultiColorReplaceFilter;

/*!
 * @pixi/filter-pixelate - v2.1.0
 * Compiled Wed, 18 Oct 2017 20:51:42 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$13="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$12="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform vec2 size;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n\treturn floor( coord / size ) * size;\n}\n\nvoid main(void)\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = pixelate(coord, size);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord);\n}\n";
var PixelateFilter=function(e){function r(r){void 0===r&&(r=10),e.call(this,vertex$13,fragment$12),this.size=r;}e&&(r.__proto__=e),(r.prototype=Object.create(e&&e.prototype)).constructor=r;var o={size:{}};return o.size.get=function(){return this.uniforms.size},o.size.set=function(e){"number"==typeof e&&(e=[e,e]),this.uniforms.size=e;},Object.defineProperties(r.prototype,o),r}(PIXI.Filter);PIXI.filters.PixelateFilter=PixelateFilter;

/*!
 * @pixi/filter-rgb-split - v2.1.0
 * Compiled Wed, 18 Oct 2017 20:51:42 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$14="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$13="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nvoid main(void)\n{\n   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/filterArea.xy).r;\n   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/filterArea.xy).g;\n   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/filterArea.xy).b;\n   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;\n}\n";
var RGBSplitFilter=function(e){function r(r,t,n){void 0===r&&(r=[-10,0]),void 0===t&&(t=[0,10]),void 0===n&&(n=[0,0]),e.call(this,vertex$14,fragment$13),this.red=r,this.green=t,this.blue=n;}e&&(r.__proto__=e),(r.prototype=Object.create(e&&e.prototype)).constructor=r;var t={red:{},green:{},blue:{}};return t.red.get=function(){return this.uniforms.red},t.red.set=function(e){this.uniforms.red=e;},t.green.get=function(){return this.uniforms.green},t.green.set=function(e){this.uniforms.green=e;},t.blue.get=function(){return this.uniforms.blue},t.blue.set=function(e){this.uniforms.blue=e;},Object.defineProperties(r.prototype,t),r}(PIXI.Filter);PIXI.filters.RGBSplitFilter=RGBSplitFilter;

/*!
 * @pixi/filter-shockwave - v2.1.0
 * Compiled Wed, 18 Oct 2017 20:51:45 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$15="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$14="varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nuniform vec2 center;\nuniform vec3 params; // 10.0, 0.8, 0.1\nuniform float time;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\n\nvoid main()\n{\n    vec2 uv = vTextureCoord * filterArea.xy / dimensions.xy;\n    vec2 coord = uv;\n\n    float dist = distance(coord, center);\n\n    if ( (dist <= (time + params.z)) && (dist >= (time - params.z)) )\n    {\n        float diff = (dist - time);\n        float powDiff = 1.0 - pow(abs(diff*params.x), params.y);\n\n        float diffTime = diff  * powDiff;\n        vec2 diffUV = normalize(uv - center);\n        coord = uv + (diffUV * diffTime);\n    }\n\n    coord *= dimensions.xy / filterArea.xy;\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    gl_FragColor = texture2D(uSampler, clampedCoord);\n    if (coord != clampedCoord) {\n        gl_FragColor *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n}\n";
var ShockwaveFilter=function(e){function t(t,r,n){void 0===t&&(t=[.5,.5]),void 0===r&&(r=[10,.8,.1]),void 0===n&&(n=0),e.call(this,vertex$15,fragment$14,{center:{type:"v2",value:{x:.5,y:.5}},params:{type:"v3",value:{x:10,y:.8,z:.1}},time:{type:"1f",value:0},dimensions:{type:"2f",value:[0,0]}}),this.center=t,this.params=r,this.time=n;}e&&(t.__proto__=e),(t.prototype=Object.create(e&&e.prototype)).constructor=t;var r={center:{},params:{},time:{}};return t.prototype.apply=function(e,t,r){this.uniforms.dimensions[0]=t.sourceFrame.width,this.uniforms.dimensions[1]=t.sourceFrame.height,e.applyFilter(this,t,r);},r.center.get=function(){return this.uniforms.center},r.center.set=function(e){this.uniforms.center=e;},r.params.get=function(){return this.uniforms.params},r.params.set=function(e){this.uniforms.params=e;},r.time.get=function(){return this.uniforms.time},r.time.set=function(e){this.uniforms.time=e;},Object.defineProperties(t.prototype,r),t}(PIXI.Filter);PIXI.filters.ShockwaveFilter=ShockwaveFilter;

/*!
 * @pixi/filter-simple-lightmap - v2.1.0
 * Compiled Wed, 18 Oct 2017 20:51:45 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$16="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$15="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform sampler2D uLightmap;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\nuniform vec4 ambientColor;\nvoid main() {\n    vec4 diffuseColor = texture2D(uSampler, vTextureCoord);\n    vec2 lightCoord = (vTextureCoord * filterArea.xy) / dimensions;\n    vec4 light = texture2D(uLightmap, lightCoord);\n    vec3 ambient = ambientColor.rgb * ambientColor.a;\n    vec3 intensity = ambient + light.rgb;\n    vec3 finalColor = diffuseColor.rgb * intensity;\n    gl_FragColor = vec4(finalColor, diffuseColor.a);\n}\n";
var SimpleLightmapFilter=function(t){function e(e,r,o){void 0===r&&(r=0),void 0===o&&(o=1),t.call(this,vertex$16,fragment$15),this.uniforms.ambientColor=new Float32Array([0,0,0,o]),this.texture=e,this.color=r;}t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e;var r={texture:{},color:{},alpha:{}};return e.prototype.apply=function(t,e,r,o){this.uniforms.dimensions[0]=e.sourceFrame.width,this.uniforms.dimensions[1]=e.sourceFrame.height,t.applyFilter(this,e,r,o);},r.texture.get=function(){return this.uniforms.uLightmap},r.texture.set=function(t){this.uniforms.uLightmap=t;},r.color.set=function(t){var e=this.uniforms.ambientColor;"number"==typeof t?(PIXI.utils.hex2rgb(t,e),this._color=t):(e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],this._color=PIXI.utils.rgb2hex(e));},r.color.get=function(){return this._color},r.alpha.get=function(){return this.uniforms.ambientColor[3]},r.alpha.set=function(t){this.uniforms.ambientColor[3]=t;},Object.defineProperties(e.prototype,r),e}(PIXI.Filter);PIXI.filters.SimpleLightmapFilter=SimpleLightmapFilter;

/*!
 * @pixi/filter-tilt-shift - v2.1.0
 * Compiled Wed, 18 Oct 2017 20:51:45 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$17="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$16="varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float blur;\nuniform float gradientBlur;\nuniform vec2 start;\nuniform vec2 end;\nuniform vec2 delta;\nuniform vec2 texSize;\n\nfloat random(vec3 scale, float seed)\n{\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n    float total = 0.0;\n\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n    vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));\n    float radius = smoothstep(0.0, 1.0, abs(dot(vTextureCoord * texSize - start, normal)) / gradientBlur) * blur;\n\n    for (float t = -30.0; t <= 30.0; t++)\n    {\n        float percent = (t + offset - 0.5) / 30.0;\n        float weight = 1.0 - abs(percent);\n        vec4 sample = texture2D(uSampler, vTextureCoord + delta / texSize * percent * radius);\n        sample.rgb *= sample.a;\n        color += sample * weight;\n        total += weight;\n    }\n\n    gl_FragColor = color / total;\n    gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\n}\n";
var TiltShiftAxisFilter=function(t){function i(i,r,e,n){void 0===i&&(i=100),void 0===r&&(r=600),void 0===e&&(e=null),void 0===n&&(n=null),t.call(this,vertex$17,fragment$16),this.uniforms.blur=i,this.uniforms.gradientBlur=r,this.uniforms.start=e||new PIXI.Point(0,window.innerHeight/2),this.uniforms.end=n||new PIXI.Point(600,window.innerHeight/2),this.uniforms.delta=new PIXI.Point(30,30),this.uniforms.texSize=new PIXI.Point(window.innerWidth,window.innerHeight),this.updateDelta();}t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i;var r={blur:{},gradientBlur:{},start:{},end:{}};return i.prototype.updateDelta=function(){this.uniforms.delta.x=0,this.uniforms.delta.y=0;},r.blur.get=function(){return this.uniforms.blur},r.blur.set=function(t){this.uniforms.blur=t;},r.gradientBlur.get=function(){return this.uniforms.gradientBlur},r.gradientBlur.set=function(t){this.uniforms.gradientBlur=t;},r.start.get=function(){return this.uniforms.start},r.start.set=function(t){this.uniforms.start=t,this.updateDelta();},r.end.get=function(){return this.uniforms.end},r.end.set=function(t){this.uniforms.end=t,this.updateDelta();},Object.defineProperties(i.prototype,r),i}(PIXI.Filter);PIXI.filters.TiltShiftAxisFilter=TiltShiftAxisFilter;var TiltShiftXFilter=function(t){function i(){t.apply(this,arguments);}return t&&(i.__proto__=t),i.prototype=Object.create(t&&t.prototype),i.prototype.constructor=i,i.prototype.updateDelta=function(){var t=this.uniforms.end.x-this.uniforms.start.x,i=this.uniforms.end.y-this.uniforms.start.y,r=Math.sqrt(t*t+i*i);this.uniforms.delta.x=t/r,this.uniforms.delta.y=i/r;},i}(TiltShiftAxisFilter);PIXI.filters.TiltShiftXFilter=TiltShiftXFilter;var TiltShiftYFilter=function(t){function i(){t.apply(this,arguments);}return t&&(i.__proto__=t),i.prototype=Object.create(t&&t.prototype),i.prototype.constructor=i,i.prototype.updateDelta=function(){var t=this.uniforms.end.x-this.uniforms.start.x,i=this.uniforms.end.y-this.uniforms.start.y,r=Math.sqrt(t*t+i*i);this.uniforms.delta.x=-i/r,this.uniforms.delta.y=t/r;},i}(TiltShiftAxisFilter);PIXI.filters.TiltShiftYFilter=TiltShiftYFilter;var TiltShiftFilter=function(t){function i(i,r,e,n){void 0===i&&(i=100),void 0===r&&(r=600),void 0===e&&(e=null),void 0===n&&(n=null),t.call(this),this.tiltShiftXFilter=new TiltShiftXFilter(i,r,e,n),this.tiltShiftYFilter=new TiltShiftYFilter(i,r,e,n);}t&&(i.__proto__=t),(i.prototype=Object.create(t&&t.prototype)).constructor=i;var r={blur:{},gradientBlur:{},start:{},end:{}};return i.prototype.apply=function(t,i,r){var e=t.getRenderTarget(!0);this.tiltShiftXFilter.apply(t,i,e),this.tiltShiftYFilter.apply(t,e,r),t.returnRenderTarget(e);},r.blur.get=function(){return this.tiltShiftXFilter.blur},r.blur.set=function(t){this.tiltShiftXFilter.blur=this.tiltShiftYFilter.blur=t;},r.gradientBlur.get=function(){return this.tiltShiftXFilter.gradientBlur},r.gradientBlur.set=function(t){this.tiltShiftXFilter.gradientBlur=this.tiltShiftYFilter.gradientBlur=t;},r.start.get=function(){return this.tiltShiftXFilter.start},r.start.set=function(t){this.tiltShiftXFilter.start=this.tiltShiftYFilter.start=t;},r.end.get=function(){return this.tiltShiftXFilter.end},r.end.set=function(t){this.tiltShiftXFilter.end=this.tiltShiftYFilter.end=t;},Object.defineProperties(i.prototype,r),i}(PIXI.Filter);PIXI.filters.TiltShiftFilter=TiltShiftFilter;

/*!
 * @pixi/filter-twist - v2.1.0
 * Compiled Wed, 18 Oct 2017 20:51:45 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$18="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var fragment$17="varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float radius;\nuniform float angle;\nuniform vec2 offset;\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 twist(vec2 coord)\n{\n    coord -= offset;\n\n    float dist = length(coord);\n\n    if (dist < radius)\n    {\n        float ratioDist = (radius - dist) / radius;\n        float angleMod = ratioDist * ratioDist * angle;\n        float s = sin(angleMod);\n        float c = cos(angleMod);\n        coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);\n    }\n\n    coord += offset;\n\n    return coord;\n}\n\nvoid main(void)\n{\n\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = twist(coord);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord );\n\n}\n";
var TwistFilter=function(o){function n(n,r,t){void 0===n&&(n=200),void 0===r&&(r=4),void 0===t&&(t=20),o.call(this,vertex$18,fragment$17),this.radius=n,this.angle=r,this.padding=t;}o&&(n.__proto__=o),(n.prototype=Object.create(o&&o.prototype)).constructor=n;var r={offset:{},radius:{},angle:{}};return r.offset.get=function(){return this.uniforms.offset},r.offset.set=function(o){this.uniforms.offset=o;},r.radius.get=function(){return this.uniforms.radius},r.radius.set=function(o){this.uniforms.radius=o;},r.angle.get=function(){return this.uniforms.angle},r.angle.set=function(o){this.uniforms.angle=o;},Object.defineProperties(n.prototype,r),n}(PIXI.Filter);PIXI.filters.TwistFilter=TwistFilter;

/*!
 * @pixi/filter-zoom-blur - v2.1.1
 * Compiled Wed, 18 Oct 2017 20:51:48 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var vertex$19="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n";
var fragment$18="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform vec2 uCenter;\nuniform float uStrength;\nuniform float uInnerRadius;\nuniform float uRadius;\n\nfloat random(vec3 scale, float seed) {\n    // use the fragment position for a different seed per-pixel\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main() {\n\n    vec2 center = uCenter.xy / filterArea.xy;\n    vec2 dir = vec2(center - vTextureCoord);\n    float dist = length(vec2(dir.x, dir.y * filterArea.y / filterArea.x));\n\n    float strength = uStrength;\n\n    const float count = 32.0;\n    float countLimit = count;\n\n    float minGradient = uInnerRadius * 0.3;\n    float gradient = uRadius * 0.3;\n\n    float innerRadius = (uInnerRadius + minGradient * 0.5) / filterArea.x;\n    float radius = (uRadius - gradient * 0.5) / filterArea.x;\n\n    float delta = 0.0;\n    float gap;\n    if (dist < innerRadius) {\n        delta = innerRadius - dist;\n        gap = minGradient;\n    } else if (dist > radius) {\n        delta = dist - radius;\n        gap = gradient;\n    }\n\n    if (delta > 0.0) {\n        float normalCount = gap / filterArea.x;\n        delta = (normalCount - delta) / normalCount;\n        countLimit *= delta;\n        strength *= delta;\n        if (countLimit < 1.0)\n        {\n            gl_FragColor = texture2D(uSampler, vTextureCoord);\n            return;\n        }\n    }\n\n    // randomize the lookup values to hide the fixed number of samples\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n\n    float total = 0.0;\n    vec4 color = vec4(0.0);\n\n    dir *= strength;\n\n    for (float t = 0.0; t < count; t++) {\n        float percent = (t + offset) / count;\n        float weight = 4.0 * (percent - percent * percent);\n        vec2 p = vTextureCoord + dir * percent;\n        vec4 sample = texture2D(uSampler, p);\n\n        // switch to pre-multiplied alpha to correctly blur transparent images\n        sample.rgb *= sample.a;\n\n        color += sample * weight;\n        total += weight;\n\n        if (t > countLimit){\n            break;\n        }\n    }\n\n    gl_FragColor = color / total;\n\n    // switch back from pre-multiplied alpha\n    gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\n}\n";
var ZoomBlurFilter=function(n){function t(t,e,r,i){void 0===t&&(t=.1),void 0===e&&(e=[0,0]),void 0===r&&(r=0),void 0===i&&(i=1e8),n.call(this,vertex$19,fragment$18),this.center=e,this.strength=t,this.innerRadius=r,this.radius=i;}n&&(t.__proto__=n),(t.prototype=Object.create(n&&n.prototype)).constructor=t;var e={center:{},strength:{},innerRadius:{},radius:{}};return e.center.get=function(){return this.uniforms.uCenter},e.center.set=function(n){this.uniforms.uCenter=n;},e.strength.get=function(){return this.uniforms.uStrength},e.strength.set=function(n){this.uniforms.uStrength=n;},e.innerRadius.get=function(){return this.uniforms.uInnerRadius},e.innerRadius.set=function(n){this.uniforms.uInnerRadius=n;},e.radius.get=function(){return this.uniforms.uRadius},e.radius.set=function(n){this.uniforms.uRadius=n;},Object.defineProperties(t.prototype,e),t}(PIXI.Filter);PIXI.filters.ZoomBlurFilter=ZoomBlurFilter;

exports.AsciiFilter = AsciiFilter;
exports.AdvancedBloomFilter = AdvancedBloomFilter;
exports.BloomFilter = BloomFilter;
exports.BulgePinchFilter = BulgePinchFilter;
exports.ColorReplaceFilter = ColorReplaceFilter;
exports.ConvolutionFilter = ConvolutionFilter;
exports.CrossHatchFilter = CrossHatchFilter;
exports.DotFilter = DotFilter;
exports.DropShadowFilter = DropShadowFilter;
exports.EmbossFilter = EmbossFilter;
exports.GlowFilter = GlowFilter;
exports.GodrayFilter = GodrayFilter;
exports.OutlineFilter = OutlineFilter;
exports.MultiColorReplaceFilter = MultiColorReplaceFilter;
exports.PixelateFilter = PixelateFilter;
exports.RGBSplitFilter = RGBSplitFilter;
exports.ShockwaveFilter = ShockwaveFilter;
exports.SimpleLightmapFilter = SimpleLightmapFilter;
exports.TiltShiftFilter = TiltShiftFilter;
exports.TiltShiftAxisFilter = TiltShiftAxisFilter;
exports.TiltShiftXFilter = TiltShiftXFilter;
exports.TiltShiftYFilter = TiltShiftYFilter;
exports.TwistFilter = TwistFilter;
exports.ZoomBlurFilter = ZoomBlurFilter;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=pixi-filters.js.map
