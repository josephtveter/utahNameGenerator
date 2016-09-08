/*
*	window.Deferred and window.ajax should be set before now, or defined with a common JS define method.  
*
*	serverUri
*	baseUri
* 	host
*	isSSL
*	method
*	requiredFields
*	requiredHeaders
*	callType
*   wds
*/

!function(t,e){"object"==typeof exports?module.exports=exports=e():"function"==typeof define&&define.amd?define([],e):t.CryptoJS=e()}(this,function(){var t=t||function(t,e){function r(t,e,r,i,n,s,o){var a=t+(e&r|~e&i)+n+o;return(a<<s|a>>>32-s)+e}function i(t,e,r,i,n,s,o){var a=t+(e&i|r&~i)+n+o;return(a<<s|a>>>32-s)+e}function n(t,e,r,i,n,s,o){var a=t+(e^r^i)+n+o;return(a<<s|a>>>32-s)+e}function s(t,e,r,i,n,s,o){var a=t+(r^(e|~i))+n+o;return(a<<s|a>>>32-s)+e}var o={},a=o.lib={},c=a.Base=function(){function t(){}return{extend:function(e){t.prototype=this;var r=new t;return e&&r.mixIn(e),r.hasOwnProperty("init")||(r.init=function(){r.$super.init.apply(this,arguments)}),r.init.prototype=r,r.$super=this,r},create:function(){var t=this.extend();return t.init.apply(t,arguments),t},init:function(){},mixIn:function(t){for(var e in t)t.hasOwnProperty(e)&&(this[e]=t[e]);t.hasOwnProperty("toString")&&(this.toString=t.toString)},clone:function(){return this.init.prototype.extend(this)}}}(),h=a.WordArray=c.extend({init:function(t,r){t=this.words=t||[],this.sigBytes=r!=e?r:4*t.length},toString:function(t){return(t||u).stringify(this)},concat:function(t){var e=this.words,r=t.words,i=this.sigBytes,n=t.sigBytes;if(this.clamp(),i%4)for(var s=0;n>s;s++){var o=r[s>>>2]>>>24-s%4*8&255;e[i+s>>>2]|=o<<24-(i+s)%4*8}else if(r.length>65535)for(var s=0;n>s;s+=4)e[i+s>>>2]=r[s>>>2];else e.push.apply(e,r);return this.sigBytes+=n,this},clamp:function(){var e=this.words,r=this.sigBytes;e[r>>>2]&=4294967295<<32-r%4*8,e.length=t.ceil(r/4)},clone:function(){var t=c.clone.call(this);return t.words=this.words.slice(0),t},random:function(e){for(var r,i=[],n=function(e){var e=e,r=987654321,i=4294967295;return function(){r=36969*(65535&r)+(r>>16)&i,e=18e3*(65535&e)+(e>>16)&i;var n=(r<<16)+e&i;return n/=4294967296,n+=.5,n*(t.random()>.5?1:-1)}},s=0;e>s;s+=4){var o=n(4294967296*(r||t.random()));r=987654071*o(),i.push(4294967296*o()|0)}return new h.init(i,e)}}),f=o.enc={},u=f.Hex={stringify:function(t){for(var e=t.words,r=t.sigBytes,i=[],n=0;r>n;n++){var s=e[n>>>2]>>>24-n%4*8&255;i.push((s>>>4).toString(16)),i.push((15&s).toString(16))}return i.join("")},parse:function(t){for(var e=t.length,r=[],i=0;e>i;i+=2)r[i>>>3]|=parseInt(t.substr(i,2),16)<<24-i%8*4;return new h.init(r,e/2)}},p=f.Latin1={stringify:function(t){for(var e=t.words,r=t.sigBytes,i=[],n=0;r>n;n++){var s=e[n>>>2]>>>24-n%4*8&255;i.push(String.fromCharCode(s))}return i.join("")},parse:function(t){for(var e=t.length,r=[],i=0;e>i;i++)r[i>>>2]|=(255&t.charCodeAt(i))<<24-i%4*8;return new h.init(r,e)}},d=f.Utf8={stringify:function(t){try{return decodeURIComponent(escape(p.stringify(t)))}catch(e){throw new Error("Malformed UTF-8 data")}},parse:function(t){return p.parse(unescape(encodeURIComponent(t)))}},l=a.BufferedBlockAlgorithm=c.extend({reset:function(){this._data=new h.init,this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=d.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_process:function(e){var r=this._data,i=r.words,n=r.sigBytes,s=this.blockSize,o=4*s,a=n/o;a=e?t.ceil(a):t.max((0|a)-this._minBufferSize,0);var c=a*s,f=t.min(4*c,n);if(c){for(var u=0;c>u;u+=s)this._doProcessBlock(i,u);var p=i.splice(0,c);r.sigBytes-=f}return new h.init(p,f)},clone:function(){var t=c.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0}),v=a.Hasher=l.extend({cfg:c.extend(),init:function(t){this.cfg=this.cfg.extend(t),this.reset()},reset:function(){l.reset.call(this),this._doReset()},update:function(t){return this._append(t),this._process(),this},finalize:function(t){t&&this._append(t);var e=this._doFinalize();return e},blockSize:16,_createHelper:function(t){return function(e,r){return new t.init(r).finalize(e)}},_createHmacHelper:function(t){return function(e,r){return new _.HMAC.init(t,r).finalize(e)}}}),_=o.algo={},y=f.Base64={stringify:function(t){var e=t.words,r=t.sigBytes,i=this._map;t.clamp();for(var n=[],s=0;r>s;s+=3)for(var o=e[s>>>2]>>>24-s%4*8&255,a=e[s+1>>>2]>>>24-(s+1)%4*8&255,c=e[s+2>>>2]>>>24-(s+2)%4*8&255,h=o<<16|a<<8|c,f=0;4>f&&r>s+.75*f;f++)n.push(i.charAt(h>>>6*(3-f)&63));var u=i.charAt(64);if(u)for(;n.length%4;)n.push(u);return n.join("")},parse:function(t){var e=t.length,r=this._map,i=r.charAt(64);if(i){var n=t.indexOf(i);-1!=n&&(e=n)}for(var s=[],o=0,a=0;e>a;a++)if(a%4){var c=r.indexOf(t.charAt(a-1))<<a%4*2,f=r.indexOf(t.charAt(a))>>>6-a%4*2;s[o>>>2]|=(c|f)<<24-o%4*8,o++}return h.create(s,o)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="},g=[];!function(){for(var e=0;64>e;e++)g[e]=4294967296*t.abs(t.sin(e+1))|0}();var B=_.MD5=v.extend({_doReset:function(){this._hash=new h.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(t,e){for(var o=0;16>o;o++){var a=e+o,c=t[a];t[a]=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8)}var h=this._hash.words,f=t[e+0],u=t[e+1],p=t[e+2],d=t[e+3],l=t[e+4],v=t[e+5],_=t[e+6],y=t[e+7],B=t[e+8],m=t[e+9],x=t[e+10],k=t[e+11],S=t[e+12],w=t[e+13],z=t[e+14],C=t[e+15],H=h[0],D=h[1],E=h[2],M=h[3];H=r(H,D,E,M,f,7,g[0]),M=r(M,H,D,E,u,12,g[1]),E=r(E,M,H,D,p,17,g[2]),D=r(D,E,M,H,d,22,g[3]),H=r(H,D,E,M,l,7,g[4]),M=r(M,H,D,E,v,12,g[5]),E=r(E,M,H,D,_,17,g[6]),D=r(D,E,M,H,y,22,g[7]),H=r(H,D,E,M,B,7,g[8]),M=r(M,H,D,E,m,12,g[9]),E=r(E,M,H,D,x,17,g[10]),D=r(D,E,M,H,k,22,g[11]),H=r(H,D,E,M,S,7,g[12]),M=r(M,H,D,E,w,12,g[13]),E=r(E,M,H,D,z,17,g[14]),D=r(D,E,M,H,C,22,g[15]),H=i(H,D,E,M,u,5,g[16]),M=i(M,H,D,E,_,9,g[17]),E=i(E,M,H,D,k,14,g[18]),D=i(D,E,M,H,f,20,g[19]),H=i(H,D,E,M,v,5,g[20]),M=i(M,H,D,E,x,9,g[21]),E=i(E,M,H,D,C,14,g[22]),D=i(D,E,M,H,l,20,g[23]),H=i(H,D,E,M,m,5,g[24]),M=i(M,H,D,E,z,9,g[25]),E=i(E,M,H,D,d,14,g[26]),D=i(D,E,M,H,B,20,g[27]),H=i(H,D,E,M,w,5,g[28]),M=i(M,H,D,E,p,9,g[29]),E=i(E,M,H,D,y,14,g[30]),D=i(D,E,M,H,S,20,g[31]),H=n(H,D,E,M,v,4,g[32]),M=n(M,H,D,E,B,11,g[33]),E=n(E,M,H,D,k,16,g[34]),D=n(D,E,M,H,z,23,g[35]),H=n(H,D,E,M,u,4,g[36]),M=n(M,H,D,E,l,11,g[37]),E=n(E,M,H,D,y,16,g[38]),D=n(D,E,M,H,x,23,g[39]),H=n(H,D,E,M,w,4,g[40]),M=n(M,H,D,E,f,11,g[41]),E=n(E,M,H,D,d,16,g[42]),D=n(D,E,M,H,_,23,g[43]),H=n(H,D,E,M,m,4,g[44]),M=n(M,H,D,E,S,11,g[45]),E=n(E,M,H,D,C,16,g[46]),D=n(D,E,M,H,p,23,g[47]),H=s(H,D,E,M,f,6,g[48]),M=s(M,H,D,E,y,10,g[49]),E=s(E,M,H,D,z,15,g[50]),D=s(D,E,M,H,v,21,g[51]),H=s(H,D,E,M,S,6,g[52]),M=s(M,H,D,E,d,10,g[53]),E=s(E,M,H,D,x,15,g[54]),D=s(D,E,M,H,u,21,g[55]),H=s(H,D,E,M,B,6,g[56]),M=s(M,H,D,E,C,10,g[57]),E=s(E,M,H,D,_,15,g[58]),D=s(D,E,M,H,w,21,g[59]),H=s(H,D,E,M,l,6,g[60]),M=s(M,H,D,E,k,10,g[61]),E=s(E,M,H,D,p,15,g[62]),D=s(D,E,M,H,m,21,g[63]),h[0]=h[0]+H|0,h[1]=h[1]+D|0,h[2]=h[2]+E|0,h[3]=h[3]+M|0},_doFinalize:function(){var e=this._data,r=e.words,i=8*this._nDataBytes,n=8*e.sigBytes;r[n>>>5]|=128<<24-n%32;var s=t.floor(i/4294967296),o=i;r[(n+64>>>9<<4)+15]=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),r[(n+64>>>9<<4)+14]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8),e.sigBytes=4*(r.length+1),this._process();for(var a=this._hash,c=a.words,h=0;4>h;h++){var f=c[h];c[h]=16711935&(f<<8|f>>>24)|4278255360&(f<<24|f>>>8)}return a},clone:function(){var t=v.clone.call(this);return t._hash=this._hash.clone(),t}});o.MD5=v._createHelper(B),o.HmacMD5=v._createHmacHelper(B);var m=[],x=_.SHA1=v.extend({_doReset:function(){this._hash=new h.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(t,e){for(var r=this._hash.words,i=r[0],n=r[1],s=r[2],o=r[3],a=r[4],c=0;80>c;c++){if(16>c)m[c]=0|t[e+c];else{var h=m[c-3]^m[c-8]^m[c-14]^m[c-16];m[c]=h<<1|h>>>31}var f=(i<<5|i>>>27)+a+m[c];f+=20>c?(n&s|~n&o)+1518500249:40>c?(n^s^o)+1859775393:60>c?(n&s|n&o|s&o)-1894007588:(n^s^o)-899497514,a=o,o=s,s=n<<30|n>>>2,n=i,i=f}r[0]=r[0]+i|0,r[1]=r[1]+n|0,r[2]=r[2]+s|0,r[3]=r[3]+o|0,r[4]=r[4]+a|0},_doFinalize:function(){var e=this._data,r=e.words,i=8*this._nDataBytes,n=8*e.sigBytes;return r[n>>>5]|=128<<24-n%32,r[(n+64>>>9<<4)+14]=t.floor(i/4294967296),r[(n+64>>>9<<4)+15]=i,e.sigBytes=4*r.length,this._process(),this._hash},clone:function(){var t=v.clone.call(this);return t._hash=this._hash.clone(),t}});o.SHA1=v._createHelper(x),o.HmacSHA1=v._createHmacHelper(x);var k=[],S=[];!function(){function e(e){for(var r=t.sqrt(e),i=2;r>=i;i++)if(!(e%i))return!1;return!0}function r(t){return 4294967296*(t-(0|t))|0}for(var i=2,n=0;64>n;)e(i)&&(8>n&&(k[n]=r(t.pow(i,.5))),S[n]=r(t.pow(i,1/3)),n++),i++}();var m=[],w=_.SHA256=v.extend({_doReset:function(){this._hash=new h.init(k.slice(0))},_doProcessBlock:function(t,e){for(var r=this._hash.words,i=r[0],n=r[1],s=r[2],o=r[3],a=r[4],c=r[5],h=r[6],f=r[7],u=0;64>u;u++){if(16>u)m[u]=0|t[e+u];else{var p=m[u-15],d=(p<<25|p>>>7)^(p<<14|p>>>18)^p>>>3,l=m[u-2],v=(l<<15|l>>>17)^(l<<13|l>>>19)^l>>>10;m[u]=d+m[u-7]+v+m[u-16]}var _=a&c^~a&h,y=i&n^i&s^n&s,g=(i<<30|i>>>2)^(i<<19|i>>>13)^(i<<10|i>>>22),B=(a<<26|a>>>6)^(a<<21|a>>>11)^(a<<7|a>>>25),x=f+B+_+S[u]+m[u],k=g+y;f=h,h=c,c=a,a=o+x|0,o=s,s=n,n=i,i=x+k|0}r[0]=r[0]+i|0,r[1]=r[1]+n|0,r[2]=r[2]+s|0,r[3]=r[3]+o|0,r[4]=r[4]+a|0,r[5]=r[5]+c|0,r[6]=r[6]+h|0,r[7]=r[7]+f|0},_doFinalize:function(){var e=this._data,r=e.words,i=8*this._nDataBytes,n=8*e.sigBytes;return r[n>>>5]|=128<<24-n%32,r[(n+64>>>9<<4)+14]=t.floor(i/4294967296),r[(n+64>>>9<<4)+15]=i,e.sigBytes=4*r.length,this._process(),this._hash},clone:function(){var t=v.clone.call(this);return t._hash=this._hash.clone(),t}});o.SHA256=v._createHelper(w),o.HmacSHA256=v._createHmacHelper(w);var z=(_.HMAC=c.extend({init:function(t,e){t=this._hasher=new t.init,"string"==typeof e&&(e=d.parse(e));var r=t.blockSize,i=4*r;e.sigBytes>i&&(e=t.finalize(e)),e.clamp();for(var n=this._oKey=e.clone(),s=this._iKey=e.clone(),o=n.words,a=s.words,c=0;r>c;c++)o[c]^=1549556828,a[c]^=909522486;n.sigBytes=s.sigBytes=i,this.reset()},reset:function(){var t=this._hasher;t.reset(),t.update(this._iKey)},update:function(t){return this._hasher.update(t),this},finalize:function(t){var e=this._hasher,r=e.finalize(t);e.reset();var i=e.finalize(this._oKey.clone().concat(r));return i}}),_.EvpKDF=c.extend({cfg:c.extend({keySize:4,hasher:B,iterations:1}),init:function(t){this.cfg=this.cfg.extend(t)},compute:function(t,e){for(var r=this.cfg,i=r.hasher.create(),n=h.create(),s=n.words,o=r.keySize,a=r.iterations;s.length<o;){c&&i.update(c);var c=i.update(t).finalize(e);i.reset();for(var f=1;a>f;f++)c=i.finalize(c),i.reset();n.concat(c)}return n.sigBytes=4*o,n}}));o.EvpKDF=function(t,e,r){return z.create(r).compute(t,e)};var C=a.Cipher=l.extend({cfg:c.extend(),createEncryptor:function(t,e){return this.create(this._ENC_XFORM_MODE,t,e)},createDecryptor:function(t,e){return this.create(this._DEC_XFORM_MODE,t,e)},init:function(t,e,r){this.cfg=this.cfg.extend(r),this._xformMode=t,this._key=e,this.reset()},reset:function(){l.reset.call(this),this._doReset()},process:function(t){return this._append(t),this._process()},finalize:function(t){t&&this._append(t);var e=this._doFinalize();return e},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(){function t(t){return"string"==typeof t?I:R}return function(e){return{encrypt:function(r,i,n){return t(i).encrypt(e,r,i,n)},decrypt:function(r,i,n){return t(i).decrypt(e,r,i,n)}}}}()}),H=(a.StreamCipher=C.extend({_doFinalize:function(){var t=this._process(!0);return t},blockSize:1}),o.mode={}),D=a.BlockCipherMode=c.extend({createEncryptor:function(t,e){return this.Encryptor.create(t,e)},createDecryptor:function(t,e){return this.Decryptor.create(t,e)},init:function(t,e){this._cipher=t,this._iv=e}}),E=H.CBC=function(){function t(t,r,i){var n=this._iv;if(n){var s=n;this._iv=e}else var s=this._prevBlock;for(var o=0;i>o;o++)t[r+o]^=s[o]}var r=D.extend();return r.Encryptor=r.extend({processBlock:function(e,r){var i=this._cipher,n=i.blockSize;t.call(this,e,r,n),i.encryptBlock(e,r),this._prevBlock=e.slice(r,r+n)}}),r.Decryptor=r.extend({processBlock:function(e,r){var i=this._cipher,n=i.blockSize,s=e.slice(r,r+n);i.decryptBlock(e,r),t.call(this,e,r,n),this._prevBlock=s}}),r}(),M=o.pad={},O=M.Pkcs7={pad:function(t,e){for(var r=4*e,i=r-t.sigBytes%r,n=i<<24|i<<16|i<<8|i,s=[],o=0;i>o;o+=4)s.push(n);var a=h.create(s,i);t.concat(a)},unpad:function(t){var e=255&t.words[t.sigBytes-1>>>2];t.sigBytes-=e}},A=(a.BlockCipher=C.extend({cfg:C.cfg.extend({mode:E,padding:O}),reset:function(){C.reset.call(this);var t=this.cfg,e=t.iv,r=t.mode;if(this._xformMode==this._ENC_XFORM_MODE)var i=r.createEncryptor;else{var i=r.createDecryptor;this._minBufferSize=1}this._mode=i.call(r,this,e&&e.words)},_doProcessBlock:function(t,e){this._mode.processBlock(t,e)},_doFinalize:function(){var t=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){t.pad(this._data,this.blockSize);var e=this._process(!0)}else{var e=this._process(!0);t.unpad(e)}return e},blockSize:4}),a.CipherParams=c.extend({init:function(t){this.mixIn(t)},toString:function(t){return(t||this.formatter).stringify(this)}})),b=o.format={},F=b.OpenSSL={stringify:function(t){var e=t.ciphertext,r=t.salt;if(r)var i=h.create([1398893684,1701076831]).concat(r).concat(e);else var i=e;return i.toString(y)},parse:function(t){var e=y.parse(t),r=e.words;if(1398893684==r[0]&&1701076831==r[1]){var i=h.create(r.slice(2,4));r.splice(0,4),e.sigBytes-=16}return A.create({ciphertext:e,salt:i})}},R=a.SerializableCipher=c.extend({cfg:c.extend({format:F}),encrypt:function(t,e,r,i){i=this.cfg.extend(i);var n=t.createEncryptor(r,i),s=n.finalize(e),o=n.cfg;return A.create({ciphertext:s,key:r,iv:o.iv,algorithm:t,mode:o.mode,padding:o.padding,blockSize:t.blockSize,formatter:i.format})},decrypt:function(t,e,r,i){i=this.cfg.extend(i),e=this._parse(e,i.format);var n=t.createDecryptor(r,i).finalize(e.ciphertext);return n},_parse:function(t,e){return"string"==typeof t?e.parse(t,this):t}}),P=o.kdf={},K=P.OpenSSL={execute:function(t,e,r,i){i||(i=h.random(8));var n=z.create({keySize:e+r}).compute(t,i),s=h.create(n.words.slice(e),4*r);return n.sigBytes=4*e,A.create({key:n,iv:s,salt:i})}},I=a.PasswordBasedCipher=R.extend({cfg:R.cfg.extend({kdf:K}),encrypt:function(t,e,r,i){i=this.cfg.extend(i);var n=i.kdf.execute(r,t.keySize,t.ivSize);i.iv=n.iv;var s=R.encrypt.call(this,t,e,n.key,i);return s.mixIn(n),s},decrypt:function(t,e,r,i){i=this.cfg.extend(i),e=this._parse(e,i.format);var n=i.kdf.execute(r,t.keySize,t.ivSize,e.salt);i.iv=n.iv;var s=R.decrypt.call(this,t,e,n.key,i);return s}});return o}(Math),e=t,r=e.lib,i=r.BlockCipher,n=e.algo,s=[],o=[],a=[],c=[],h=[],f=[],u=[],p=[],d=[],l=[];!function(){for(var t=[],e=0;256>e;e++)t[e]=128>e?e<<1:e<<1^283;for(var r=0,i=0,e=0;256>e;e++){var n=i^i<<1^i<<2^i<<3^i<<4;n=n>>>8^255&n^99,s[r]=n,o[n]=r;var v=t[r],_=t[v],y=t[_],g=257*t[n]^16843008*n;a[r]=g<<24|g>>>8,c[r]=g<<16|g>>>16,h[r]=g<<8|g>>>24,f[r]=g;var g=16843009*y^65537*_^257*v^16843008*r;u[n]=g<<24|g>>>8,p[n]=g<<16|g>>>16,d[n]=g<<8|g>>>24,l[n]=g,r?(r=v^t[t[t[y^v]]],i^=t[t[i]]):r=i=1}}();var v=[0,1,2,4,8,16,32,64,128,27,54],_=n.AES=i.extend({_doReset:function(){for(var t=this._key,e=t.words,r=t.sigBytes/4,i=this._nRounds=r+6,n=4*(i+1),o=this._keySchedule=[],a=0;n>a;a++)if(r>a)o[a]=e[a];else{var c=o[a-1];a%r?r>6&&a%r==4&&(c=s[c>>>24]<<24|s[c>>>16&255]<<16|s[c>>>8&255]<<8|s[255&c]):(c=c<<8|c>>>24,c=s[c>>>24]<<24|s[c>>>16&255]<<16|s[c>>>8&255]<<8|s[255&c],c^=v[a/r|0]<<24),o[a]=o[a-r]^c}for(var h=this._invKeySchedule=[],f=0;n>f;f++){var a=n-f;if(f%4)var c=o[a];else var c=o[a-4];h[f]=4>f||4>=a?c:u[s[c>>>24]]^p[s[c>>>16&255]]^d[s[c>>>8&255]]^l[s[255&c]]}},encryptBlock:function(t,e){this._doCryptBlock(t,e,this._keySchedule,a,c,h,f,s)},decryptBlock:function(t,e){var r=t[e+1];t[e+1]=t[e+3],t[e+3]=r,this._doCryptBlock(t,e,this._invKeySchedule,u,p,d,l,o);var r=t[e+1];t[e+1]=t[e+3],t[e+3]=r},_doCryptBlock:function(t,e,r,i,n,s,o,a){for(var c=this._nRounds,h=t[e]^r[0],f=t[e+1]^r[1],u=t[e+2]^r[2],p=t[e+3]^r[3],d=4,l=1;c>l;l++){var v=i[h>>>24]^n[f>>>16&255]^s[u>>>8&255]^o[255&p]^r[d++],_=i[f>>>24]^n[u>>>16&255]^s[p>>>8&255]^o[255&h]^r[d++],y=i[u>>>24]^n[p>>>16&255]^s[h>>>8&255]^o[255&f]^r[d++],g=i[p>>>24]^n[h>>>16&255]^s[f>>>8&255]^o[255&u]^r[d++];h=v,f=_,u=y,p=g}var v=(a[h>>>24]<<24|a[f>>>16&255]<<16|a[u>>>8&255]<<8|a[255&p])^r[d++],_=(a[f>>>24]<<24|a[u>>>16&255]<<16|a[p>>>8&255]<<8|a[255&h])^r[d++],y=(a[u>>>24]<<24|a[p>>>16&255]<<16|a[h>>>8&255]<<8|a[255&f])^r[d++],g=(a[p>>>24]<<24|a[h>>>16&255]<<16|a[f>>>8&255]<<8|a[255&u])^r[d++];t[e]=v,t[e+1]=_,t[e+2]=y,t[e+3]=g},keySize:8});return e.AES=i._createHelper(_),t});

/*
 Copyright 2013 Daniel Wirtz <dcode@dcode.io>
 Copyright 2009 The Closure Library Authors. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS-IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * @license long.js (c) 2013 Daniel Wirtz <dcode@dcode.io>
 * Released under the Apache License, Version 2.0
 * see: https://github.com/dcodeIO/long.js for details
 */
(function(global, factory) {
    /* AMD */ if (typeof define === 'function' && define["amd"])
        define([], factory);
    /* CommonJS */ else if (typeof require === 'function' && typeof module === "object" && module && module["exports"])
        module["exports"] = factory();
    /* Global */ else
        (global["dcodeIO"] = global["dcodeIO"] || {})["Long"] = factory();

})(this, function() {
    "use strict";

    /**
     * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
     *  See the from* functions below for more convenient ways of constructing Longs.
     * @exports Long
     * @class A Long class for representing a 64 bit two's-complement integer value.
     * @param {number} low The low (signed) 32 bits of the long
     * @param {number} high The high (signed) 32 bits of the long
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @constructor
     */
    function Long(low, high, unsigned) {

        /**
         * The low 32 bits as a signed value.
         * @type {number}
         * @expose
         */
        this.low = low | 0;

        /**
         * The high 32 bits as a signed value.
         * @type {number}
         * @expose
         */
        this.high = high | 0;

        /**
         * Whether unsigned or not.
         * @type {boolean}
         * @expose
         */
        this.unsigned = !!unsigned;
    }

    // The internal representation of a long is the two given signed, 32-bit values.
    // We use 32-bit pieces because these are the size of integers on which
    // Javascript performs bit-operations.  For operations like addition and
    // multiplication, we split each number into 16 bit pieces, which can easily be
    // multiplied within Javascript's floating-point representation without overflow
    // or change in sign.
    //
    // In the algorithms below, we frequently reduce the negative case to the
    // positive case by negating the input(s) and then post-processing the result.
    // Note that we must ALWAYS check specially whether those values are MIN_VALUE
    // (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
    // a positive number, it overflows back into a negative).  Not handling this
    // case would often result in infinite recursion.
    //
    // Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
    // methods on which they depend.

    /**
     * An indicator used to reliably determine if an object is a Long or not.
     * @type {boolean}
     * @const
     * @expose
     * @private
     */
    Long.prototype.__isLong__;

    Object.defineProperty(Long.prototype, "__isLong__", {
        value: true,
        enumerable: false,
        configurable: false
    });

    /**
     * @function
     * @param {*} obj Object
     * @returns {boolean}
     * @inner
     */
    function isLong(obj) {
        return (obj && obj["__isLong__"]) === true;
    }

    /**
     * Tests if the specified object is a Long.
     * @function
     * @param {*} obj Object
     * @returns {boolean}
     * @expose
     */
    Long.isLong = isLong;

    /**
     * A cache of the Long representations of small integer values.
     * @type {!Object}
     * @inner
     */
    var INT_CACHE = {};

    /**
     * A cache of the Long representations of small unsigned integer values.
     * @type {!Object}
     * @inner
     */
    var UINT_CACHE = {};

    /**
     * @param {number} value
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromInt(value, unsigned) {
        var obj, cachedObj, cache;
        if (unsigned) {
            value >>>= 0;
            if (cache = (0 <= value && value < 256)) {
                cachedObj = UINT_CACHE[value];
                if (cachedObj)
                    return cachedObj;
            }
            obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
            if (cache)
                UINT_CACHE[value] = obj;
            return obj;
        } else {
            value |= 0;
            if (cache = (-128 <= value && value < 128)) {
                cachedObj = INT_CACHE[value];
                if (cachedObj)
                    return cachedObj;
            }
            obj = fromBits(value, value < 0 ? -1 : 0, false);
            if (cache)
                INT_CACHE[value] = obj;
            return obj;
        }
    }

    /**
     * Returns a Long representing the given 32 bit integer value.
     * @function
     * @param {number} value The 32 bit integer in question
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @returns {!Long} The corresponding Long value
     * @expose
     */
    Long.fromInt = fromInt;

    /**
     * @param {number} value
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromNumber(value, unsigned) {
        if (isNaN(value) || !isFinite(value))
            return unsigned ? UZERO : ZERO;
        if (unsigned) {
            if (value < 0)
                return UZERO;
            if (value >= TWO_PWR_64_DBL)
                return MAX_UNSIGNED_VALUE;
        } else {
            if (value <= -TWO_PWR_63_DBL)
                return MIN_VALUE;
            if (value + 1 >= TWO_PWR_63_DBL)
                return MAX_VALUE;
        }
        if (value < 0)
            return fromNumber(-value, unsigned).neg();
        return fromBits((value % TWO_PWR_32_DBL) | 0, (value / TWO_PWR_32_DBL) | 0, unsigned);
    }

    /**
     * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
     * @function
     * @param {number} value The number in question
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @returns {!Long} The corresponding Long value
     * @expose
     */
    Long.fromNumber = fromNumber;

    /**
     * @param {number} lowBits
     * @param {number} highBits
     * @param {boolean=} unsigned
     * @returns {!Long}
     * @inner
     */
    function fromBits(lowBits, highBits, unsigned) {
        return new Long(lowBits, highBits, unsigned);
    }

    /**
     * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
     *  assumed to use 32 bits.
     * @function
     * @param {number} lowBits The low 32 bits
     * @param {number} highBits The high 32 bits
     * @param {boolean=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @returns {!Long} The corresponding Long value
     * @expose
     */
    Long.fromBits = fromBits;

    /**
     * @function
     * @param {number} base
     * @param {number} exponent
     * @returns {number}
     * @inner
     */
    var pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)

    /**
     * @param {string} str
     * @param {(boolean|number)=} unsigned
     * @param {number=} radix
     * @returns {!Long}
     * @inner
     */
    function fromString(str, unsigned, radix) {
        if (str.length === 0)
            throw Error('empty string');
        if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity")
            return ZERO;
        if (typeof unsigned === 'number') {
            // For goog.math.long compatibility
            radix = unsigned,
            unsigned = false;
        } else {
            unsigned = !! unsigned;
        }
        radix = radix || 10;
        if (radix < 2 || 36 < radix)
            throw RangeError('radix');

        var p;
        if ((p = str.indexOf('-')) > 0)
            throw Error('interior hyphen');
        else if (p === 0) {
            return fromString(str.substring(1), unsigned, radix).neg();
        }

        // Do several (8) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        var radixToPower = fromNumber(pow_dbl(radix, 8));

        var result = ZERO;
        for (var i = 0; i < str.length; i += 8) {
            var size = Math.min(8, str.length - i),
                value = parseInt(str.substring(i, i + size), radix);
            if (size < 8) {
                var power = fromNumber(pow_dbl(radix, size));
                result = result.mul(power).add(fromNumber(value));
            } else {
                result = result.mul(radixToPower);
                result = result.add(fromNumber(value));
            }
        }
        result.unsigned = unsigned;
        return result;
    }

    /**
     * Returns a Long representation of the given string, written using the specified radix.
     * @function
     * @param {string} str The textual representation of the Long
     * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to `false` for signed
     * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
     * @returns {!Long} The corresponding Long value
     * @expose
     */
    Long.fromString = fromString;

    /**
     * @function
     * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
     * @returns {!Long}
     * @inner
     */
    function fromValue(val) {
        if (val /* is compatible */ instanceof Long)
            return val;
        if (typeof val === 'number')
            return fromNumber(val);
        if (typeof val === 'string')
            return fromString(val);
        // Throws for non-objects, converts non-instanceof Long:
        return fromBits(val.low, val.high, val.unsigned);
    }

    /**
     * Converts the specified value to a Long.
     * @function
     * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val Value
     * @returns {!Long}
     * @expose
     */
    Long.fromValue = fromValue;

    // NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
    // no runtime penalty for these.

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_16_DBL = 1 << 16;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_24_DBL = 1 << 24;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;

    /**
     * @type {number}
     * @const
     * @inner
     */
    var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;

    /**
     * @type {!Long}
     * @const
     * @inner
     */
    var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);

    /**
     * @type {!Long}
     * @inner
     */
    var ZERO = fromInt(0);

    /**
     * Signed zero.
     * @type {!Long}
     * @expose
     */
    Long.ZERO = ZERO;

    /**
     * @type {!Long}
     * @inner
     */
    var UZERO = fromInt(0, true);

    /**
     * Unsigned zero.
     * @type {!Long}
     * @expose
     */
    Long.UZERO = UZERO;

    /**
     * @type {!Long}
     * @inner
     */
    var ONE = fromInt(1);

    /**
     * Signed one.
     * @type {!Long}
     * @expose
     */
    Long.ONE = ONE;

    /**
     * @type {!Long}
     * @inner
     */
    var UONE = fromInt(1, true);

    /**
     * Unsigned one.
     * @type {!Long}
     * @expose
     */
    Long.UONE = UONE;

    /**
     * @type {!Long}
     * @inner
     */
    var NEG_ONE = fromInt(-1);

    /**
     * Signed negative one.
     * @type {!Long}
     * @expose
     */
    Long.NEG_ONE = NEG_ONE;

    /**
     * @type {!Long}
     * @inner
     */
    var MAX_VALUE = fromBits(0xFFFFFFFF|0, 0x7FFFFFFF|0, false);

    /**
     * Maximum signed value.
     * @type {!Long}
     * @expose
     */
    Long.MAX_VALUE = MAX_VALUE;

    /**
     * @type {!Long}
     * @inner
     */
    var MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF|0, 0xFFFFFFFF|0, true);

    /**
     * Maximum unsigned value.
     * @type {!Long}
     * @expose
     */
    Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;

    /**
     * @type {!Long}
     * @inner
     */
    var MIN_VALUE = fromBits(0, 0x80000000|0, false);

    /**
     * Minimum signed value.
     * @type {!Long}
     * @expose
     */
    Long.MIN_VALUE = MIN_VALUE;

    /**
     * @alias Long.prototype
     * @inner
     */
    var LongPrototype = Long.prototype;

    /**
     * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
     * @returns {number}
     * @expose
     */
    LongPrototype.toInt = function toInt() {
        return this.unsigned ? this.low >>> 0 : this.low;
    };

    /**
     * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
     * @returns {number}
     * @expose
     */
    LongPrototype.toNumber = function toNumber() {
        if (this.unsigned)
            return ((this.high >>> 0) * TWO_PWR_32_DBL) + (this.low >>> 0);
        return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
    };

    /**
     * Converts the Long to a string written in the specified radix.
     * @param {number=} radix Radix (2-36), defaults to 10
     * @returns {string}
     * @override
     * @throws {RangeError} If `radix` is out of range
     * @expose
     */
    LongPrototype.toString = function toString(radix) {
        radix = radix || 10;
        if (radix < 2 || 36 < radix)
            throw RangeError('radix');
        if (this.isZero())
            return '0';
        if (this.isNegative()) { // Unsigned Longs are never negative
            if (this.eq(MIN_VALUE)) {
                // We need to change the Long value before it can be negated, so we remove
                // the bottom-most digit in this base and then recurse to do the rest.
                var radixLong = fromNumber(radix),
                    div = this.div(radixLong),
                    rem1 = div.mul(radixLong).sub(this);
                return div.toString(radix) + rem1.toInt().toString(radix);
            } else
                return '-' + this.neg().toString(radix);
        }

        // Do several (6) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned),
            rem = this;
        var result = '';
        while (true) {
            var remDiv = rem.div(radixToPower),
                intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0,
                digits = intval.toString(radix);
            rem = remDiv;
            if (rem.isZero())
                return digits + result;
            else {
                while (digits.length < 6)
                    digits = '0' + digits;
                result = '' + digits + result;
            }
        }
    };

    /**
     * Gets the high 32 bits as a signed integer.
     * @returns {number} Signed high bits
     * @expose
     */
    LongPrototype.getHighBits = function getHighBits() {
        return this.high;
    };

    /**
     * Gets the high 32 bits as an unsigned integer.
     * @returns {number} Unsigned high bits
     * @expose
     */
    LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
        return this.high >>> 0;
    };

    /**
     * Gets the low 32 bits as a signed integer.
     * @returns {number} Signed low bits
     * @expose
     */
    LongPrototype.getLowBits = function getLowBits() {
        return this.low;
    };

    /**
     * Gets the low 32 bits as an unsigned integer.
     * @returns {number} Unsigned low bits
     * @expose
     */
    LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
        return this.low >>> 0;
    };

    /**
     * Gets the number of bits needed to represent the absolute value of this Long.
     * @returns {number}
     * @expose
     */
    LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
        if (this.isNegative()) // Unsigned Longs are never negative
            return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
        var val = this.high != 0 ? this.high : this.low;
        for (var bit = 31; bit > 0; bit--)
            if ((val & (1 << bit)) != 0)
                break;
        return this.high != 0 ? bit + 33 : bit + 1;
    };

    /**
     * Tests if this Long's value equals zero.
     * @returns {boolean}
     * @expose
     */
    LongPrototype.isZero = function isZero() {
        return this.high === 0 && this.low === 0;
    };

    /**
     * Tests if this Long's value is negative.
     * @returns {boolean}
     * @expose
     */
    LongPrototype.isNegative = function isNegative() {
        return !this.unsigned && this.high < 0;
    };

    /**
     * Tests if this Long's value is positive.
     * @returns {boolean}
     * @expose
     */
    LongPrototype.isPositive = function isPositive() {
        return this.unsigned || this.high >= 0;
    };

    /**
     * Tests if this Long's value is odd.
     * @returns {boolean}
     * @expose
     */
    LongPrototype.isOdd = function isOdd() {
        return (this.low & 1) === 1;
    };

    /**
     * Tests if this Long's value is even.
     * @returns {boolean}
     * @expose
     */
    LongPrototype.isEven = function isEven() {
        return (this.low & 1) === 0;
    };

    /**
     * Tests if this Long's value equals the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.equals = function equals(other) {
        if (!isLong(other))
            other = fromValue(other);
        if (this.unsigned !== other.unsigned && (this.high >>> 31) === 1 && (other.high >>> 31) === 1)
            return false;
        return this.high === other.high && this.low === other.low;
    };

    /**
     * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.eq = LongPrototype.equals;

    /**
     * Tests if this Long's value differs from the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.notEquals = function notEquals(other) {
        return !this.eq(/* validates */ other);
    };

    /**
     * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.neq = LongPrototype.notEquals;

    /**
     * Tests if this Long's value is less than the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.lessThan = function lessThan(other) {
        return this.comp(/* validates */ other) < 0;
    };

    /**
     * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.lt = LongPrototype.lessThan;

    /**
     * Tests if this Long's value is less than or equal the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
        return this.comp(/* validates */ other) <= 0;
    };

    /**
     * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.lte = LongPrototype.lessThanOrEqual;

    /**
     * Tests if this Long's value is greater than the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.greaterThan = function greaterThan(other) {
        return this.comp(/* validates */ other) > 0;
    };

    /**
     * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.gt = LongPrototype.greaterThan;

    /**
     * Tests if this Long's value is greater than or equal the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
        return this.comp(/* validates */ other) >= 0;
    };

    /**
     * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {boolean}
     * @expose
     */
    LongPrototype.gte = LongPrototype.greaterThanOrEqual;

    /**
     * Compares this Long's value with the specified's.
     * @param {!Long|number|string} other Other value
     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
     *  if the given one is greater
     * @expose
     */
    LongPrototype.compare = function compare(other) {
        if (!isLong(other))
            other = fromValue(other);
        if (this.eq(other))
            return 0;
        var thisNeg = this.isNegative(),
            otherNeg = other.isNegative();
        if (thisNeg && !otherNeg)
            return -1;
        if (!thisNeg && otherNeg)
            return 1;
        // At this point the sign bits are the same
        if (!this.unsigned)
            return this.sub(other).isNegative() ? -1 : 1;
        // Both are positive if at least one is unsigned
        return (other.high >>> 0) > (this.high >>> 0) || (other.high === this.high && (other.low >>> 0) > (this.low >>> 0)) ? -1 : 1;
    };

    /**
     * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
     * @function
     * @param {!Long|number|string} other Other value
     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
     *  if the given one is greater
     * @expose
     */
    LongPrototype.comp = LongPrototype.compare;

    /**
     * Negates this Long's value.
     * @returns {!Long} Negated Long
     * @expose
     */
    LongPrototype.negate = function negate() {
        if (!this.unsigned && this.eq(MIN_VALUE))
            return MIN_VALUE;
        return this.not().add(ONE);
    };

    /**
     * Negates this Long's value. This is an alias of {@link Long#negate}.
     * @function
     * @returns {!Long} Negated Long
     * @expose
     */
    LongPrototype.neg = LongPrototype.negate;

    /**
     * Returns the sum of this and the specified Long.
     * @param {!Long|number|string} addend Addend
     * @returns {!Long} Sum
     * @expose
     */
    LongPrototype.add = function add(addend) {
        if (!isLong(addend))
            addend = fromValue(addend);

        // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

        var a48 = this.high >>> 16;
        var a32 = this.high & 0xFFFF;
        var a16 = this.low >>> 16;
        var a00 = this.low & 0xFFFF;

        var b48 = addend.high >>> 16;
        var b32 = addend.high & 0xFFFF;
        var b16 = addend.low >>> 16;
        var b00 = addend.low & 0xFFFF;

        var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        c00 += a00 + b00;
        c16 += c00 >>> 16;
        c00 &= 0xFFFF;
        c16 += a16 + b16;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c32 += a32 + b32;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c48 += a48 + b48;
        c48 &= 0xFFFF;
        return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
    };

    /**
     * Returns the difference of this and the specified Long.
     * @param {!Long|number|string} subtrahend Subtrahend
     * @returns {!Long} Difference
     * @expose
     */
    LongPrototype.subtract = function subtract(subtrahend) {
        if (!isLong(subtrahend))
            subtrahend = fromValue(subtrahend);
        return this.add(subtrahend.neg());
    };

    /**
     * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
     * @function
     * @param {!Long|number|string} subtrahend Subtrahend
     * @returns {!Long} Difference
     * @expose
     */
    LongPrototype.sub = LongPrototype.subtract;

    /**
     * Returns the product of this and the specified Long.
     * @param {!Long|number|string} multiplier Multiplier
     * @returns {!Long} Product
     * @expose
     */
    LongPrototype.multiply = function multiply(multiplier) {
        if (this.isZero())
            return ZERO;
        if (!isLong(multiplier))
            multiplier = fromValue(multiplier);
        if (multiplier.isZero())
            return ZERO;
        if (this.eq(MIN_VALUE))
            return multiplier.isOdd() ? MIN_VALUE : ZERO;
        if (multiplier.eq(MIN_VALUE))
            return this.isOdd() ? MIN_VALUE : ZERO;

        if (this.isNegative()) {
            if (multiplier.isNegative())
                return this.neg().mul(multiplier.neg());
            else
                return this.neg().mul(multiplier).neg();
        } else if (multiplier.isNegative())
            return this.mul(multiplier.neg()).neg();

        // If both longs are small, use float multiplication
        if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
            return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);

        // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
        // We can skip products that would overflow.

        var a48 = this.high >>> 16;
        var a32 = this.high & 0xFFFF;
        var a16 = this.low >>> 16;
        var a00 = this.low & 0xFFFF;

        var b48 = multiplier.high >>> 16;
        var b32 = multiplier.high & 0xFFFF;
        var b16 = multiplier.low >>> 16;
        var b00 = multiplier.low & 0xFFFF;

        var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        c00 += a00 * b00;
        c16 += c00 >>> 16;
        c00 &= 0xFFFF;
        c16 += a16 * b00;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c16 += a00 * b16;
        c32 += c16 >>> 16;
        c16 &= 0xFFFF;
        c32 += a32 * b00;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c32 += a16 * b16;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c32 += a00 * b32;
        c48 += c32 >>> 16;
        c32 &= 0xFFFF;
        c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
        c48 &= 0xFFFF;
        return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
    };

    /**
     * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
     * @function
     * @param {!Long|number|string} multiplier Multiplier
     * @returns {!Long} Product
     * @expose
     */
    LongPrototype.mul = LongPrototype.multiply;

    /**
     * Returns this Long divided by the specified. The result is signed if this Long is signed or
     *  unsigned if this Long is unsigned.
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Quotient
     * @expose
     */
    LongPrototype.divide = function divide(divisor) {
        if (!isLong(divisor))
            divisor = fromValue(divisor);
        if (divisor.isZero())
            throw Error('division by zero');
        if (this.isZero())
            return this.unsigned ? UZERO : ZERO;
        var approx, rem, res;
        if (!this.unsigned) {
            // This section is only relevant for signed longs and is derived from the
            // closure library as a whole.
            if (this.eq(MIN_VALUE)) {
                if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
                    return MIN_VALUE;  // recall that -MIN_VALUE == MIN_VALUE
                else if (divisor.eq(MIN_VALUE))
                    return ONE;
                else {
                    // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                    var halfThis = this.shr(1);
                    approx = halfThis.div(divisor).shl(1);
                    if (approx.eq(ZERO)) {
                        return divisor.isNegative() ? ONE : NEG_ONE;
                    } else {
                        rem = this.sub(divisor.mul(approx));
                        res = approx.add(rem.div(divisor));
                        return res;
                    }
                }
            } else if (divisor.eq(MIN_VALUE))
                return this.unsigned ? UZERO : ZERO;
            if (this.isNegative()) {
                if (divisor.isNegative())
                    return this.neg().div(divisor.neg());
                return this.neg().div(divisor).neg();
            } else if (divisor.isNegative())
                return this.div(divisor.neg()).neg();
            res = ZERO;
        } else {
            // The algorithm below has not been made for unsigned longs. It's therefore
            // required to take special care of the MSB prior to running it.
            if (!divisor.unsigned)
                divisor = divisor.toUnsigned();
            if (divisor.gt(this))
                return UZERO;
            if (divisor.gt(this.shru(1))) // 15 >>> 1 = 7 ; with divisor = 8 ; true
                return UONE;
            res = UZERO;
        }

        // Repeat the following until the remainder is less than other:  find a
        // floating-point that approximates remainder / other *from below*, add this
        // into the result, and subtract it from the remainder.  It is critical that
        // the approximate value is less than or equal to the real value so that the
        // remainder never becomes negative.
        rem = this;
        while (rem.gte(divisor)) {
            // Approximate the result of division. This may be a little greater or
            // smaller than the actual value.
            approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));

            // We will tweak the approximate result by changing it in the 48-th digit or
            // the smallest non-fractional digit, whichever is larger.
            var log2 = Math.ceil(Math.log(approx) / Math.LN2),
                delta = (log2 <= 48) ? 1 : pow_dbl(2, log2 - 48),

            // Decrease the approximation until it is smaller than the remainder.  Note
            // that if it is too large, the product overflows and is negative.
                approxRes = fromNumber(approx),
                approxRem = approxRes.mul(divisor);
            while (approxRem.isNegative() || approxRem.gt(rem)) {
                approx -= delta;
                approxRes = fromNumber(approx, this.unsigned);
                approxRem = approxRes.mul(divisor);
            }

            // We know the answer can't be zero... and actually, zero would cause
            // infinite recursion since we would make no progress.
            if (approxRes.isZero())
                approxRes = ONE;

            res = res.add(approxRes);
            rem = rem.sub(approxRem);
        }
        return res;
    };

    /**
     * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
     * @function
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Quotient
     * @expose
     */
    LongPrototype.div = LongPrototype.divide;

    /**
     * Returns this Long modulo the specified.
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Remainder
     * @expose
     */
    LongPrototype.modulo = function modulo(divisor) {
        if (!isLong(divisor))
            divisor = fromValue(divisor);
        return this.sub(this.div(divisor).mul(divisor));
    };

    /**
     * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
     * @function
     * @param {!Long|number|string} divisor Divisor
     * @returns {!Long} Remainder
     * @expose
     */
    LongPrototype.mod = LongPrototype.modulo;

    /**
     * Returns the bitwise NOT of this Long.
     * @returns {!Long}
     * @expose
     */
    LongPrototype.not = function not() {
        return fromBits(~this.low, ~this.high, this.unsigned);
    };

    /**
     * Returns the bitwise AND of this Long and the specified.
     * @param {!Long|number|string} other Other Long
     * @returns {!Long}
     * @expose
     */
    LongPrototype.and = function and(other) {
        if (!isLong(other))
            other = fromValue(other);
        return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
    };

    /**
     * Returns the bitwise OR of this Long and the specified.
     * @param {!Long|number|string} other Other Long
     * @returns {!Long}
     * @expose
     */
    LongPrototype.or = function or(other) {
        if (!isLong(other))
            other = fromValue(other);
        return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
    };

    /**
     * Returns the bitwise XOR of this Long and the given one.
     * @param {!Long|number|string} other Other Long
     * @returns {!Long}
     * @expose
     */
    LongPrototype.xor = function xor(other) {
        if (!isLong(other))
            other = fromValue(other);
        return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
    };

    /**
     * Returns this Long with bits shifted to the left by the given amount.
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     * @expose
     */
    LongPrototype.shiftLeft = function shiftLeft(numBits) {
        if (isLong(numBits))
            numBits = numBits.toInt();
        if ((numBits &= 63) === 0)
            return this;
        else if (numBits < 32)
            return fromBits(this.low << numBits, (this.high << numBits) | (this.low >>> (32 - numBits)), this.unsigned);
        else
            return fromBits(0, this.low << (numBits - 32), this.unsigned);
    };

    /**
     * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     * @expose
     */
    LongPrototype.shl = LongPrototype.shiftLeft;

    /**
     * Returns this Long with bits arithmetically shifted to the right by the given amount.
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     * @expose
     */
    LongPrototype.shiftRight = function shiftRight(numBits) {
        if (isLong(numBits))
            numBits = numBits.toInt();
        if ((numBits &= 63) === 0)
            return this;
        else if (numBits < 32)
            return fromBits((this.low >>> numBits) | (this.high << (32 - numBits)), this.high >> numBits, this.unsigned);
        else
            return fromBits(this.high >> (numBits - 32), this.high >= 0 ? 0 : -1, this.unsigned);
    };

    /**
     * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     * @expose
     */
    LongPrototype.shr = LongPrototype.shiftRight;

    /**
     * Returns this Long with bits logically shifted to the right by the given amount.
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     * @expose
     */
    LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
        if (isLong(numBits))
            numBits = numBits.toInt();
        numBits &= 63;
        if (numBits === 0)
            return this;
        else {
            var high = this.high;
            if (numBits < 32) {
                var low = this.low;
                return fromBits((low >>> numBits) | (high << (32 - numBits)), high >>> numBits, this.unsigned);
            } else if (numBits === 32)
                return fromBits(high, 0, this.unsigned);
            else
                return fromBits(high >>> (numBits - 32), 0, this.unsigned);
        }
    };

    /**
     * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
     * @function
     * @param {number|!Long} numBits Number of bits
     * @returns {!Long} Shifted Long
     * @expose
     */
    LongPrototype.shru = LongPrototype.shiftRightUnsigned;

    /**
     * Converts this Long to signed.
     * @returns {!Long} Signed long
     * @expose
     */
    LongPrototype.toSigned = function toSigned() {
        if (!this.unsigned)
            return this;
        return fromBits(this.low, this.high, false);
    };

    /**
     * Converts this Long to unsigned.
     * @returns {!Long} Unsigned long
     * @expose
     */
    LongPrototype.toUnsigned = function toUnsigned() {
        if (this.unsigned)
            return this;
        return fromBits(this.low, this.high, true);
    };

    return Long;
});


( function ( global ) {

	var delay = function () {
		if ( typeof setImmediate != "undefined" ) {
			return setImmediate;
		}
		else if ( typeof process != "undefined" ) {
			return process.nextTick;
		}
		else {
			return function ( arg ) {
				setTimeout( arg, 0 );
			};
		}
	}();
	/* Start Deferred */
	var Deferred = function()
	{
		var self = this;
		this.onDone = [];
		this.onAlways = [];
		this.onFail = [];
		this.state = Deferred.state.PENDING;

		this.promise = function ( arg ) {
			return self;
		};

		/**
		 * Registers a function to execute after Promise is reconciled
		 *
		 * @method always
		 * @param  {Function} arg Function to execute
		 * @return {Object}       Deferred instance
		 */
		this.always = function ( arg ) {
			if ( typeof arg == "function" ) {
				if(self.state !== Deferred.state.PENDING)
				{
					delay(arg(self.value, self.isResolved()));
				}
				self.onAlways.push( arg );
			}
			return self;
		};

		/**
		 * Registers a function to execute after Promise is resolved
		 *
		 * @method done
		 * @param  {Function} arg Function to execute
		 * @return {Object}       Deferred instance
		 */
		this.done = function ( arg ) {
			if ( typeof arg == "function" ) {
				if(self.state === Deferred.state.SUCCESS)
				{
					delay(arg(self.value, true));
				}
				self.onDone.push( arg );
			}
			return self;
		};

		/**
		 * Registers a function to execute after Promise is rejected
		 *
		 * @method fail
		 * @param  {Function} arg Function to execute
		 * @return {Object}       Deferred instance
		 */
		self.fail = function ( arg ) {
			if ( typeof arg == "function" ) {
				if(self.state === Deferred.state.FAILURE)
				{
					delay(arg(self.value, false));
				}
				self.onFail.push( arg );
			}
			return this;
		};

		/**
		 * Determines if Deferred is rejected
		 *
		 * @method isRejected
		 * @return {Boolean} `true` if rejected
		 */
		this.isRejected = function () {
			return ( self.state === Deferred.state.FAILURE );
		};

		/**
		 * Determines if Deferred is resolved
		 *
		 * @method isResolved
		 * @return {Boolean} `true` if resolved
		 */
		this.isResolved = function () {
			return ( self.state === Deferred.state.SUCCESS );
		};

		/**
		 * Rejects the Promise
		 *
		 * @method reject
		 * @param  {Mixed} arg Rejection outcome
		 * @return {Object}    Deferred instance
		 */
		this.reject = function ( arg ) {
			if ( self.state > Deferred.state.PENDING ) {
				return self;
			}

			self.value = arg;
			self.state = Deferred.state.FAILURE;
			self.process();
			return self;
		};

		/**
		 * Resolves the Promise
		 *
		 * @method resolve
		 * @param  {Mixed} arg Resolution outcome
		 * @return {Object}    Deferred instance
		 */
		this.resolve = function ( arg ) {
			if ( self.state > Deferred.state.PENDING ) {
				return self;
			}
			self.value = arg;
			self.state = Deferred.state.SUCCESS;
			self.process(arg);
			return self;
		};

		/**
		 * Gets the state of the Promise
		 *
		 * @method state
		 * @return {String} Describes the status
		 */
		this.status = function () {
			var state = self.state;
			var rtn = Deferred.status[state];
			
			return rtn;
		};

		/**
		 * Registers handler(s) for the Promise
		 *
		 * @method then
		 * @param  {Function} success Executed when/if promise is resolved
		 * @param  {Function} failure [Optional] Executed when/if promise is broken
		 * @return {Object}           New Promise instance
		 */
		this.then = function ( onFulfilled, onRejected ) {
			self.done( onFulfilled );
			self.fail( onRejected );
			return self;
		};

		/**
		 * Processes `handlers` queue
		 *
		 * @method process
		 * @return {Object} Promise instance
		 */
		this.process = function(arg) {
			var success, value;

			if ( self.state === Deferred.state.PENDING ) {
				return self;
			}

			value   = self.value || arg;
			success = self.state === Deferred.state.SUCCESS;

			if(self.state === Deferred.state.SUCCESS)
			{
				var doneLen = self.onDone.length;
				for(var d=0;d<doneLen;d++)
				{
					try 
					{
						self.onDone[d](value, success);
					}
					catch(e)
					{
						console.warn("Deferred onDone Fail: "+e.message);
					}
				}
			}
				
			if(self.state === Deferred.state.FAILURE)
			{
				var failLen = self.onFail.length;
				for(var f=0;f<failLen;f++)
				{
					try 
					{
						self.onFail[f](value, success);
					}
					catch(e)
					{
						console.warn("Deferred onFail Fail: "+e.message);
					}
				}
			}

			var allLen = self.onAlways.length;
			for(var a=0;a<allLen;a++)
			{
				
				try 
				{
					self.onAlways[a](value, success);
				}
				catch(e)
				{
					console.warn("Deferred onAlways Fail: "+e.message);
				}
			}

			return self;
		};

	};// END

	/**
	 * Accepts Deferreds or Promises as arguments or an Array
	 *
	 * @method when
	 * @return {Object} Deferred instance
	 */
	Deferred.when = function () {
		var i     = 0,
		    defer = new Deferred(),
		    args  = [].slice.call( arguments ),
		    nth,
		    callback = null;

		// Did we receive an Array? if so it overrides any other arguments
		if ( args[0] instanceof Array ) {
			args = args[0];
		}
		if( typeof arguments[1] === "function")
		{
			callback = arguments[1];
		}

		// How many instances to observe?
		nth = args.length;

		// None, end on next tick
		if ( nth === 0 ) {
			defer.resolve( null );
		}
		// Setup and wait
		else {
			each( args, function ( p ) {
				p.then( function () {
					if ( ++i === nth && !defer.isResolved() ) {
						if ( args.length > 1 ) {
							defer.resolve( args.map( function ( obj ) {
								return obj.value;
							} ) );
							if ( callback ) {
							callback(args.map( function ( obj ) {
									return obj.value;
								} ));
							}
							
						}
						else {
							defer.resolve( args[0].value );
							if ( callback ) {
							callback( args[0].value );
							}
						}
					}
				}, function () {
					if ( !defer.isResolved() ) {
						if ( args.length > 1 ) {
							defer.reject( args.map( function ( obj ) {
								return obj.value;
							} ) );
							if ( callback ) {
							callback(args.map( function ( obj ) {
									return obj.value;
								} ));
							}
						}
						else {
							defer.reject( args[0].value );
							if ( callback ) {
							callback( args[0].value );
							}
						}
					}
				} );
			} );
		}

		return defer;
	};



	// Setting constructor loop
	// Deferred.prototype.constructor = Deferred;



	/**
	 * States of a Promise
	 *
	 * @private
	 * @type {Object}
	 */
	Deferred.state = {
		PENDING : 0,
		FAILURE : 1,
		SUCCESS : 2
	};

	/**
	 * Status of a Promise
	 *
	 * @private
	 * @type {Array}
	 */
	Deferred.status = [
		"pending",
		"rejected",
		"resolved"
	];

	/**
	 * Iterates obj and executes fn
	 *
	 * Parameters for fn are 'value', 'index'
	 *
	 * @method each
	 * @private
	 * @param  {Array}    obj Array to iterate
	 * @param  {Function} fn  Function to execute on index values
	 * @return {Array}        Array
	 */
	function each ( obj, fn ) {
		var nth = obj.length,
		    i   = -1;

		while ( ++i < nth ) {
			if ( fn.call( obj, obj[i], i ) === false ) {
				break;
			}
		}

		return obj;
	}

	if ( typeof exports !== "undefined" ) {
	    module.exports = Deferred;
	}
	else if ( typeof define === "function" ) {
	    define( function () {
	        return Deferred;
	    } );
	}
	else {
	    window.Deferred = Deferred;
	}


	/* End Deferred */


/*
Multipart notes

try {
  if (typeof XMLHttpRequest.prototype.sendAsBinary == 'undefined') {
    XMLHttpRequest.prototype.sendAsBinary = function(text){
      var data = new ArrayBuffer(text.length);
      var ui8a = new Uint8Array(data, 0);
      for (var i = 0; i < text.length; i++) ui8a[i] = (text.charCodeAt(i) & 0xff);
      this.send(ui8a);
    }
  }
} catch (e) {}



var xhr  = new XMLHttpRequest();
...
xhr.open("POST", url, true);

var boundary = '------multipartformboundary' + (new Date).getTime(),
dashdash = '--',
crlf = '\r\n',


content = dashdash+boundary+crlf+'Content-Disposition: form-data; name="NAMEOFVARIABLEINPHP";"'+crlf+crlf+VARIABLEWITHBASE64IMAGE+crlf+dashdash+boundary+dashdash+crlf;


xhr.setRequestHeader("Content-type", "multipart/form-data; boundary="+boundary);
xhr.setRequestHeader("Content-length", content.length);
xhr.setRequestHeader("Connection", "close");
// execute
xhr.send(content);


*/

	try {
	  	if (typeof XMLHttpRequest.prototype.sendAsBinary == 'undefined') {
	    	XMLHttpRequest.prototype.sendAsBinary = function(text){
	      		var data = new ArrayBuffer(text.length);
	      		var ui8a = new Uint8Array(data, 0);
	      		for (var i = 0; i < text.length; i++) ui8a[i] = (text.charCodeAt(i) & 0xff);
	      		this.send(ui8a);
	    	}
	  	}
	} catch (e)
	{
		console.warn("Ajax sendAsBinary not set");
	}


	/* Start Ajax */
	function ajax (params, retry) {
		return new Ajax(params, retry);
	}

	var DEFAULT_TIMEOUT = 20000;
	var DEFAULT_METHOD = "GET";
	var DEFAULT_RETRY = 5;
	var DEFAULT_CONTENT_TYPE = 'application/x-www-form-urlencoded; charset=UTF-8';
	var DEFAULT_DATA_TYPE = "json"; // dataType (default: Intelligent Guess (xml, json, script, or html))
	var Ajax = function(params, retry)
	{
		if(retry)
		{
			console.log("Ajax retry {}", retry);
		}
		var boundary = '------multipartformboundary' + (new Date).getTime();
		var dashdash = '--';
		var crlf = '\r\n';
		var multipart = params.contentType && params.contentType.indexOf("multipart") !== -1 ? true : false;
		var content = null;
		params = params || {};
		retry = retry || 0;
		var self = this;
		this.requestParams = params;
		this.onDone = [];
		this.onAlways = [];
		this.onFail = [];
		this.requestType = params.requestType;
		this.url = params.url;
		this.retry = params.maxRetry || this.url.indexOf("http") === -1 ? 1 : DEFAULT_RETRY;
		this.xhr = new XMLHttpRequest();
		var dataType = params.dataType || DEFAULT_DATA_TYPE;
		var method = params.method === "GET" || params.method === "POST" ? params.method : DEFAULT_METHOD;
		var async = params.async || true;

		var sendData = "";
		if(params.data)
		{
			if(typeof params.data === "object")
			{
				for(var item in params.data)
				{
					var getVal = item+"="+encodeURIComponent(params.data[item]);
					if(method === "GET" && this.url.indexOf(getVal) !== -1 )
					{
						// Skip it
					}
					else
					{
						if(sendData.length > 0)
						{
							sendData += "&";
						}
						sendData += getVal;
					}
				}
			}
			else if(typeof params.data === "string")
			{
				sendData = params.data;
			}

			if(sendData.length > 0 && method === "GET")
			{
				if(this.url.indexOf("?") === -1)
				{
					this.url += "?";
				}
				else
				{
					this.url += "&";
				}
				this.url += sendData;
			}

		}

		// navigator.userAgent	"Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; HPDTDF; BRI/1; .NET4.0E; .NET4.0C; GWX:QUALIFIED; rv:11.0) like Gecko"
		// || navigator.userAgent.indexOf("Windows Phone") !== -1
		var ua = navigator.userAgent.toString();
		var isTrident = ua.indexOf("Trident") !== -1 ? true : false;
		if(isTrident === false)
		{
			this.xhr.timeout = params.timeout ? params.timeout : DEFAULT_TIMEOUT; // Set timeout to 4 seconds (4000 milliseconds)
		}
		

		this.xhr.open(method, this.url, async);
		this.contentType = params.contentType ? params.contentType : DEFAULT_CONTENT_TYPE;
		
		if(multipart)
		{
			// content = params.data.data;
			this.contentType += "; boundary="+boundary;
/*

> Expect: 100-continue
> 
< HTTP/1.1 100 Continue
< HTTP/1.1 200 OK
< Server: nginx/1.6.2
< Date: Tue, 01 Mar 2016 00:29:55 GMT
< Content-Type: image/jpeg
< Transfer-Encoding: chunked
< Connection: keep-alive
< Keep-Alive: timeout=270
< Access-Control-Allow-Origin: http://lt1-static.shoutgameplay.com
< Access-Control-Allow-Credentials: true

*/



		}
		if(!params.headers || ( params.headers && !params.headers["Content-Type"] ) )
		{
			this.xhr.setRequestHeader("Content-Type", this.contentType);
		}
		if(params.headers)
		{
			if(typeof(params.headers) === "object")
			{
				for(var item in params.headers)
				{
					this.xhr.setRequestHeader(item, params.headers[item]);
				}
			}
			if(!params.headers["X-Requested-With"])
			{
				this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			}
			
		}
		this.statusCode = null;
		this.responseObj = {};
		

		var responseType = params.responseType || params.dataType || DEFAULT_DATA_TYPE;
		var failed = false;
		
		this.done = function(fun)
		{
			if(typeof(fun) === "function")
			{
				self.onDone.push(fun);
			}
			return this;
		};
		this.success = this.done;
		
		this.fail = function(fun)
		{
			if(typeof(fun) === "function")
			{
				self.onFail.push(fun);
			}
			return this;
		};
		this.always = function(fun)
		{
			if(typeof(fun) === "function")
			{
				self.onAlways.push(fun);
			}
			return this;
		};
		if(params.error)
		{
			this.fail(params.error);
		}
		if(params.success)
		{
			this.done(params.success);
		}
		if(params.complete)
		{
			this.always(params.complete);
		}
		this.resolveCompletedFile = function(url, status, responseText, headers)
		{
			var response = responseText;
			switch(responseType)
			{
				case "json":
					try 
					{
						if(typeof(responseText) === "string")
						{
							responseText = responseText.replace(/(\r\n|\n|\r)/gm,"");
							response = JSON.parse(responseText);
						}
						else
						{
							response = responseText;
						}
						
					}
					catch(e)
					{
						console.warn("fnAjax JSON.parse Fail: "+e.message+" | "+responseText);
						response = responseText;
					}
				break;
				default:
					response = responseText;
				break;
			}
			var fireFun = function()
			{
				var len = self.onDone.length, i=0, alen = self.onAlways.length;
				for(i=0;i<len;i++)
				{
					self.onDone[i](response, headers, self.requestType, self.xhr);
				}
				for(i=0;i<alen;i++)
				{
					self.onAlways[i](response, headers, self.requestType, self.xhr);
				}
				self.xhr = null;
			};
			delay(fireFun());
		};

		this.resolveFailFile = function(e, errorObj)
		{
			var fireFun = function()
			{
				var len = self.onFail.length, i=0, alen = self.onAlways.length;
				var response = errorObj;
				for(i=0;i<len;i++)
				{
					self.onFail[i](response, self.requestType, self.xhr);
				}
				for(i=0;i<alen;i++)
				{
					self.onAlways[i](response, self.requestType, self.xhr);
				}
			};
			if(!failed)
			{
				failed = true;
				delay(fireFun());
			}
		};

		var parseHeaders = function()
		{
			var headers = {};
			var arr = self.xhr.getAllResponseHeaders().split("\n");
			var len = arr.length;
			for(var i=0;i<len;i++)
			{
				if(arr[i].length > 0)
				{
					var idx = arr[i].indexOf(":");
					if(idx > 0)
					{
						var key = arr[i].substring(0, idx);
						var val = arr[i].substring(idx+1).trim();
						headers[key] = val;
					}
				}
			}
			return headers;
		};
		this.xhr.onreadystatechange = function() 
		{
			self.statusCode = self.xhr.status;
	    	if(self.xhr.readyState === 4 && self.xhr.status === 200) 
	    	{
	    		self.responseObj = {
	    			url: self.url, 
	    			status: self.xhr.status, 
	    			responseText: self.xhr.responseText,
	    			requestType: self.requestType
	    		};
	    		var headers = parseHeaders();
	      		self.resolveCompletedFile(self.url, self.xhr.status, self.xhr.responseText, headers);
	    	}
	    	else if(self.xhr.status !== 200 && self.xhr.status !== 0) // fail fast
	    	{
	    		var errorType = null;
	    		switch(self.xhr.status)
	    		{
	    			case 404:
	    				errorType = "NotFound";
	    			break;
	    			default:
	    				errorType = "unknown";
	    			break;
	    		}
	    		self.resolveFailFile({}, {errorType: errorType, status: self.xhr.status, requestType: self.requestType, requestParams: params});
	    	}
	  	};

		this.xhr.ontimeout = function(e)
		{ 
			if(retry <= self.retry)
			{
				retry++;
				params.timeout = self.xhr.timeout + (retry * 1000);
				delay(function(){
					var nextCall = ajax(params, retry);
					nextCall.fail(function(result)
					{
						self.resolveFailFile(e, {errorType: "xhrTimeout"});
					});
					nextCall.done(function(responseText, requestType, status, url)
					{
						self.resolveCompletedFile(url, status, responseText);
					});
				});
					
			}
			else
			{
				self.resolveFailFile(e, {errorType: "xhrTimeout"});
			}
		};

		this.xhr.onabort = function(e)
		{ 
			self.resolveFailFile(e, {errorType: "xhrAbort"});
		};

		// this.xhr.onload = function(e) {
		// 	debugger;
		//     var text = e.target.responseText;
		//     debugger;
		// };

		this.xhr.onerror = function(e)
		{
			self.resolveFailFile(e, {errorType: "xhrError", status: self.xhr.status, requestType: self.requestType, requestParams: params});
		};

		if(multipart)
		{
			var filetype = null;
			var fileObject = params.data.file;
			if ( fileObject.type == '' ){
		        filetype = 'application/octet-stream';
		    } else {
		        filetype = fileObject.type;
		    }
		    //this used to work
			// content = dashdash + boundary + crlf 
			// + "Content-Transfer-Encoding: BASE64;"
			// + "Content-Disposition: form-data;" + "name=\"file\";" 
			// + "filename=\"" + unescape(encodeURIComponent(params.data.filename)) 
			// + "\"" + crlf + "Content-Type: " + filetype 
			// + crlf + crlf + params.data.result 
			// + crlf + dashdash + boundary + dashdash;

			/* iframe way



			var f = document.createElement("form");
			f.setAttribute('method',"post");
			f.setAttribute('action',"submit.php");

			var i = document.createElement("input"); //input element, text
			i.setAttribute('type',"text");
			i.setAttribute('name',"username");

			var s = document.createElement("input"); //input element, Submit button
			s.setAttribute('type',"submit");
			s.setAttribute('value',"Submit");

			f.appendChild(i);
			f.appendChild(s);

			//and some more input elements here
			//and dont forget to add a submit button

			document.getElementsByTagName('body')[0].appendChild(f);

			*/

			
			// Content-Transfer-Encoding := "BASE64"

			// content = dashdash+boundary+crlf+'Content-Disposition: form-data; name="";"'+crlf+crlf+params.data.file+crlf+dashdash+boundary+dashdash+crlf;

			// var iframe = document.createElement("iframe");
			// iframe.src="about:blank";
			// iframe.addEventListener('load', function (e) {
				// debugger;
				var file = params.data.file;
			    // var myElement= document.createElement("label");
			    // myElement.innerHTML="blabla";
			    // miiframe.contentDocument.body.appendChild(myElement);
			    // var form = iframe.contentDocument.getElementById("submitFile");
			    // if(!form)
			    // {
			  //   	var f = document.createElement("form");
					// // f.setAttribute('method',"post");
					
					// // f.setAttribute('id',"submitFile");

					// // f.setAttribute('action',params.data.fileUrl);

					// var i = document.createElement("input"); 
					// i.setAttribute('type',"file");
					// i.setAttribute('name',"file");
					// i.value = params.value.;
					// // i.setAttribute('value', file);
					// f.appendChild(i);
					// // document.body.appendChild(f);
					// // f.submit();
			  //   // }
			  //   // else
			    // {
			    // 	form.submit();
			    // }
					
				

			// }, false);

			// document.body.appendChild(iframe);

			
				
			var formData = new FormData(params.data.form);
			// formData.append("file", file);
			// var iframe = document.createElement('iframe');
			// document.body.appendChild(formData);
			// debugger;
			


			// this.xhr.sendAsBinary(formData);
			this.xhr.send(formData);
			// this.xhr.sendAsBinary(content);
			// f.style.display="none";
			// this.xhr.send(formData);
		}
	  	else if(method === "GET")
	  	{
	  		this.xhr.send(null);
	  	}
	  	else
	  	{
	  		var data = sendData.length > 0 ? sendData : null;
	  		this.xhr.send( data );
	  	}
	  	return this;
	  	
	};

			

	// Setting constructor loop
	Ajax.prototype.constructor = Ajax;



	// Node, AMD & window supported
	if ( typeof exports !== "undefined" ) {
		module.exports = ajax;
	}
	else if ( typeof define === "function" ) {
		define( function () {
			return ajax;
		} );
	}
	else {
		window.ajax = ajax;
	}

	/* End Ajax */

	var SystemDetect = function()
	{
	    var self = this;
	    self.ua = navigator.userAgent;
	    this.browser = null;
	    this.version = null;
	    this.os = null;
	    this.mobileDevice = null;
	    this.standalone = null;
	    self.dataOS = null;
	    self.osVersion = null;

	    var isFacebookEmbedded = function()
	    {
	        return self.ua.indexOf("FBAN") > -1;
	    };

	    var isFlexSupported = function()
	    {
	        var supported = true;
	        var isPropertySupported = function(property)
	        {
	            var found = false;
	            var prefix = ["", "-webkit-", "-moz-", "-o-"];
	            if(document.body.style)
	            {
	                for(var i=0;i<prefix.length;i++)
	                {
	                    if(document.body.style[prefix[i]+property] || document.body.style[prefix[i]+property] === "")
	                    {
	                        found = true;
	                        break;
	                    }
	                }
	            }
	            return found;
	        };

	        if(!isPropertySupported("flex"))
	        {
	            supported = false;
	        }
	        return supported;
	    };

	    this.searchString = function(data) 
	    {
	        for (var i=0;i<data.length;i++) {
	            var dataString = data[i].string;
	            var dataProp = data[i].prop;
	            self.versionSearchString = data[i].versionSearch || data[i].identity;
	            if (dataString) {
	                if (dataString.indexOf(data[i].subString) != -1)
	                    return data[i].identity;
	            }
	            else if (dataProp)
	                return data[i].identity;
	        }
	    };

	    this.searchVersion = function(dataString)
	    {
	        var index = dataString.indexOf(self.versionSearchString);
	        if (index == -1) return;
	        return parseFloat(dataString.substring(index+self.versionSearchString.length+1));
	    };

	    this.iosVersion = function()
	    {
	        var deviceAgent = self.ua.toLowerCase();
	        if(/(iphone|ipod|ipad).* os 6_/.test(deviceAgent))
	        {
	            self.osVersion = 6;
	        }
	        else if(/(iphone|ipod|ipad).* os 7_/.test(deviceAgent))
	        {
	            self.osVersion = 7;
	        }
	        else if(/(iphone|ipod|ipad).* os 8_/.test(deviceAgent))
	        {
	            self.osVersion = 8;
	        }
	        else if(/(iphone|ipod|ipad).* os 9_/.test(deviceAgent))
	        {
	            self.osVersion = 9;
	        }
	        else if(/(iphone|ipod|ipad).* os 10_/.test(deviceAgent))
	        {
	            self.osVersion = 10;
	        }
	        
	        return self.osVersion;
	    };

	    this.getMobile = function()
	    {
	        var mobileDevice = null;
	        if(self.ua.match(/IEMobile/i) )
	        {
	            mobileDevice = "iemobile";
	        }
	        else if(self.ua.match(/Windows Phone/i))
	        {
	            mobileDevice = "iemobile";
	        }
	        else if(self.ua.match(/Android/i))
	        {
	            mobileDevice = "android";
	        }
	        else if(self.ua.match(/BlackBerry/i) )
	        {
	            mobileDevice = "blackBerry";
	        }
	        else if(self.ua.match(/iPhone/i) )
	        {
	            mobileDevice = "iphone";
	            self.iosVersion();
	        }
	        else if(self.ua.match(/iPad/i) )
	        {
	            mobileDevice = "ipad";
	            self.iosVersion();
	        }
	        else if(self.ua.match(/iPod/i) )
	        {
	            mobileDevice = "ipod";
	            self.iosVersion();
	        }
	        else if(self.ua.match(/Opera Mini/i) )
	        {
	            mobileDevice = "operamini";
	        }
	        else
	        {
	            mobileDevice = null;
	        }

	        return mobileDevice;
	    };

	    this.dataBrowser = [
	        {   string: self.ua,
	            subString: "OmniWeb",
	            versionSearch: "OmniWeb/",
	            identity: "OmniWeb"
	        },
	        {
	            string: navigator.vendor,
	            subString: "Apple",
	            identity: "Safari",
	            versionSearch: "Version"
	        },
	        {
	            prop: window.opera,
	            identity: "Opera",
	            versionSearch: "Version"
	        },
	        {
	            string: navigator.vendor,
	            subString: "iCab",
	            identity: "iCab"
	        },
	        {
	            string: navigator.vendor,
	            subString: "KDE",
	            identity: "Konqueror"
	        },
	        {
	            string: self.ua,
	            subString: "Firefox",
	            identity: "Firefox"
	        },
	        {
	            string: navigator.vendor,
	            subString: "Camino",
	            identity: "Camino"
	        },
	        {       // for newer Netscapes (6+)
	            string: self.ua,
	            subString: "Netscape",
	            identity: "Netscape"
	        },
	        {
	            string: self.ua,
	            subString: "MSIE",
	            identity: "Explorer",
	            versionSearch: "MSIE"
	        },
	        {
	            string: self.ua,
	            subString: "Trident",
	            identity: "Explorer",
	            versionSearch: "rv"
	        },
	        {
	            string: self.ua,
	            subString: "Edge",
	            identity: "Explorer"
	        },
	        {
	            string: self.ua,
	            subString: "Chrome",
	            identity: "Chrome"
	        },
	        {
	            string: self.ua,
	            subString: "Gecko",
	            identity: "Mozilla",
	            versionSearch: "rv"
	        },
	        {       // for older Netscapes (4-)
	            string: self.ua,
	            subString: "Mozilla",
	            identity: "Netscape",
	            versionSearch: "Mozilla"
	        }
	    ];

	    this.dataOS = [
	        {
	            string: navigator.platform,
	            subString: "Windows NT 5.1",
	            identity: "Windows XP"
	        },
	        {
	            string: self.ua,
	            subString: "Windows NT 6.0",
	            identity: "Windows Vista"
	        },
	        {
	            string: self.ua,
	            subString: "Windows NT 6.1",
	            identity: "Windows 7"
	        },
	        {
	            string: self.ua,
	            subString: "Windows NT 6.1; Win64; x64",
	            identity: "Windows 7 (Win64)"
	        },
	        {
	            string: self.ua,
	            subString: "Windows NT 6.2",
	            identity: "Windows 8"
	        },
	        {
	            string: self.ua,
	            subString: "Windows NT 6.3",
	            identity: "Windows 8.1"
	        },
	        {
	            string: self.ua,
	            subString: "Windows NT 10",
	            identity: "Windows 10"
	        },
	        {
	            string: self.ua,
	            subString: "Windows Phone 10",
	            identity: "Windows Phone 10"
	        },
	        {
	            string: self.ua,
	            subString: "Windows",
	            identity: "Windows"
	        },
	        {
	            string: self.ua,
	            subString: "Intel MacOS X",
	            identity: "Intel MacOS X"
	        },
	        {
	            string: self.ua,
	            subString: "Intel Mac OS X",
	            identity: "Intel Mac OS X"
	        },
	        {
	            string: self.ua,
	            subString: "iPhone",
	            identity: "iPhone/iPod"
	        },
	        {
	            string: self.ua,
	            subString: "MacOS",
	            identity: "Mac OS"
	        },
	        {
	            string: self.ua,
	            subString: "Mac OS",
	            identity: "Mac OS"
	        },
	        {
	            string: self.ua,
	            subString: "Linux i686",
	            identity: "Linux x86"
	        },
	        {
	            string: self.ua,
	            subString: "Linux x86_64",
	            identity: "Linux x64"
	        },
	        {
	            string: self.ua,
	            subString: "Linux",
	            identity: "Linux"
	        },
	        {
	            string: self.ua,
	            subString: "Android",
	            identity: "Android"
	        },
	        {
	            string: self.ua,
	            subString: "FreeBSD i686",
	            identity: "FreeBSD x86"
	        },
	        {
	            string: self.ua,
	            subString: "FreeBSD x86_64",
	            identity: "FreeBSD x64"
	        },
	        {
	            string: self.ua,
	            subString: "FreeBSD",
	            identity: "FreeBSD"
	        },
	        {
	            string: self.ua,
	            subString: "Mobile",
	            identity: "Mobile Android"
	        },
	        {
	            string: self.ua,
	            subString: "Tablet",
	            identity: "Android Tablet"
	        }
	    ];

	    self.browser = self.searchString(self.dataBrowser) || null;
	    self.version = self.searchVersion(self.ua) || self.searchVersion(self.ua) || null;
	    self.os = self.searchString(self.dataOS) || null;
	    self.mobileDevice = self.getMobile();
	    self.standalone = window.navigator.standalone;
	    self.FBAN = isFacebookEmbedded(); // Facebook ios
	    self.FBAV = self.ua.toLowerCase().indexOf("fbav") !== -1 && self.ua.toLowerCase().indexOf("android") !== -1 ? true : false; // Facebook Android
	    self.twitter = self.ua.toLowerCase().indexOf("twitter") !== -1 ? true : false;
	    self.flex = isFlexSupported();

	    return {browser: self.browser, version: self.version, os: self.os, twitter: self.twitter, mobileDevice: self.mobileDevice, standalone: self.standalone, FBAV: self.FBAV ,FBAN: self.FBAN, flex: self.flex, osVersion: self.osVersion};
	};
	    
	if ( typeof exports !== "undefined" ) {
	    module.exports = SystemDetect;
	}
	else if ( typeof define === "function" ) {
	    define( "com.component.SystemDetect", SystemDetect);
	}
	else {
	    window.SystemDetect = SystemDetect;
	}
	//# sourceURL=/modules/com/component/SystemDetect.js


	var ShoutCall = function(params)
	{
		var self = this;
		this.serverUri = params.serverUri || null;
		this.baseAjax = params.baseAjax || ShoutCall.BASE_AJAX;
		this.host = params.host || null;
		this.requiredFields = params.requiredFields || [];
		this.requiredHeaders = params.requiredHeaders || [];
		this.requestType = params.requestType || "deafult"; // wds
		this.srd = params.srd || null;
		this.primaryId = params.primaryId || null;

		this.DEFAULT_isSsl = params.ssl || params.ssl === false ? params.ssl : ShoutCall.DEFAULT_isSsl;
		this.dontSendRequestParams = params.dontSendRequestParams || params.dontSendRequestParams === false ? params.dontSendRequestParams : ShoutCall.DEFAULT_getDontSendRequestParams;
		this.method = params.method || ShoutCall.DEFAULT_method;
		this.cache = params.cache || ShoutCall.DEFAULT_cache;
		this.contentType = params.contentType || ShoutCall.DEFAULT_contentType;
		this.dataType = params.dataType || ShoutCall.DEFAULT_dataType;
		this.timeout = params.timeout || ShoutCall.DEFAULT_timeout;
		this.sendHeaders = params.sendHeaders || ShoutCall.DEFAULT_sendHeaders;
		this.updateCallback = params.callback || null;
		this.emailSha256Hash = null;
		this.docType = null;

		var Deferred = null;
		RequireLite("Deferred", function(result)
		{
			Deferred = result;
		});
		var ajax = null;
		RequireLite("Ajax", function(result)
		{
			ajax = result;
		});
		var CryptoJS = null;
		RequireLite("CryptoJS", function(result)
		{
			CryptoJS = result;
		});
		var Long = null;
		RequireLite("Long", function(result)
		{
			Long = result;
		});
		// this.publish = function(docType)
		// {
		// 	var deferred = new Deferred();
		// 	var params = {};
		// 	var data = {toWds: self.getToWds(), docType: self.docType};
		// 	params.url = self.generateUrlForRequest(data, "publish");
		// 	params.cache = false;
	 //        params.method = "POST";
	 //        params.contentType = self.getRequestContentType();
	 //        params.dataType = self.serverReturnType();
	 //        params.timeout = self.getTimeout();
	 //        params.data = data;
	 //        params.dontSendRequestData = false;
	 //       	params.actionType = "publish";
	 //        params.subscriberEmail = self.subscriber ? self.subscriber.primaryId || self.subscriber.email || self.subscriber.facebookId : null;
	 //        params.headers = self.getResponseHeaders(params.actionType, false);
	 //        params.requestType = "publish";
		// 	var done = function(result)
		// 	{
		// 		debugger;
		// 	};
		// 	var fail = function(errorObj)
		// 	{
		// 		debugger;
		// 	};
		// 	ajax(params).done(done).fail(fail);
		// 	return deferred.promise();
		// };

		this.serverCall = function(data)
		{
			var deferred = new Deferred();
			data = data || {};

			var params = {};
			params.url = self.generateUrlForRequest(data);
			if(typeof(params.url) !== "string")
			{
				deferred.reject(params.url);
				return;
			}
			params.cache = self.cache ? self.cache : ShoutCall.DEFAULT_cache;
	        params.method = self.getServerMethod();
	        params.contentType = self.getRequestContentType();
	        params.dataType = self.serverReturnType();
	        params.timeout = self.getTimeout();
	        params.data = self.formatRequestDataForServer(data);
	        params.dontSendRequestData = self.getDontSendRequestParams();
	       	params.actionType = self.getActionType();
	        params.subscriberEmail = self.subscriber ? self.subscriber.primaryId || self.subscriber.email || self.subscriber.facebookId : null;
	        params.headers = self.getResponseHeaders();
	        params.requestType = self.requestType;

			var done = function(response, headers)// response, self.requestType, status, url, headers
			{
				if(response.success === false)
				{
					deferred.reject(response);
				}
				else
				{
					var result = self.deserializeFromServer(response);
					if(self.updateCallback)
					{
						self.updateCallback(result);
					}
					deferred.resolve(result);
				}					
			};
			var fail = function(responseObj, requestType, xhr) //response, self.requestType, self.xhr
			{
				responseObj.requestType = requestType;
				responseObj.statusText = xhr.statusText;
				responseObj.url = xhr.responseURL;
				if(responseObj.status === 404 && self.docType && self.publish)
				{
					self.publish().done(deferred.resolve).fail(deferred.reject);
				}
				else if(responseObj.status === 503) // server maintenance
				{
					responseObj.errorType = "serverMaintenance";
					// deferred.reject(responseObj);
				}
				else if(responseObj.status === 403 && responseObj.success === false && responseObj.forcedUpgrade)// 403 - success === false && forcedUpgrade
				{
					responseObj.errorType = "forcedUpgrade";
					// deferred.reject(responseObj);
				}
				else if(responseObj.status === 401)
				{
					responseObj.errorType = "MUST_AUTHENTICATE";
					// deferred.resolve(responseObj);
				}
				else if(responseObj.status === 400)
				{
					responseObj.errorType = "BAD_REQUEST";
					// deferred.resolve(responseObj);
				}
				deferred.reject(responseObj);

				console.info("BaseCallModel.serverCall FAIL - "+requestType+" responseObj: "+ JSON.stringify(responseObj));
				
			};
			ajax(params).done(done).fail(fail);
			return deferred.promise();
		};

	    this.getSubscriberEmail = function(requestType, params)
	    {
	    	return self.primaryId || (self.subscriber ? self.subscriber.email || self.subscriber.facebookId : null);
	    };

	    this.getServerHost = function(requestType) // TODO GET HOST BY ACTION
		{
			requestType = requestType || self.requestType;
			var host = self.host || ShoutCall.HOST;
			if(self.srd)
			{
				var actionType = self.getActionType(requestType);
				var serverObj = self.getServerObjectForAction(actionType);
				var serverDomainNameSet = self.getDomainNameSetForUrl(serverObj, actionType, self.getSubscriberEmail());
				if (isEmpty(serverObj.domainNameIndex))
		            serverObj.domainNameIndex = 0;

		        host = serverDomainNameSet[serverObj.domainNameIndex];
			}
			else if(requestType !== "default" && requestType !== "srd")
			{
				host = null;
			}
	        return host;
		};

		var getServerUri = function(params, requestType)
		{
			var serverUri = null;
			if(requestType === "publish")
			{
				serverUri = "publish";
			}
			else
			{
				serverUri = typeof(self.serverUri) === "function" ? self.serverUri(params, self.subscriber) : self.serverUri;
		        if(!serverUri)
		        {
		        	console.warn("BaseCallModel.generateUrlForRequest no serverUri");
		        }
			}
				
		    return serverUri;
		};

		this.generateUrlForRequest = function(params, requestType)
		{
	        var host = self.getServerHost(requestType);
	        if(typeof(host) === "string")
	        {
	        	var ssl = self.isSsl(host) === true ? "https://" : "http://";
		        var base = self.baseAjax;
		        var serverUri = getServerUri(params, requestType);
				return ssl + host + base + serverUri;
	        }
	        else
	        {
	        	console.warn("ShoutCall.generateUrlForRequest: BAD_HOST");
	        	return {errorType: "BAD_HOST"};
	        }  
		};

		this.isSsl = function(host)
		{
			var rtn = false;
			
			if((host && host.indexOf(":") !== -1 && host.indexOf("44") !== -1) || (self.requestType === "PUBLISH"))
			{
				rtn = true;
			}
			else if(document.location.protocol === "https:")
	        {
	        	// debugger;
	            rtn = true;
	        }
	        else
	        {
	        	rtn = self.DEFAULT_isSsl;
	        }
	        return rtn;
		};

		this.getActionType = function(requestType)
		{
			result = requestType || self.requestType || "default";
		 //    if(self.requestType === "sync")
			// {
			// 	debugger;
			// }
		    switch(result)
		    {
		    // 	case self.PUBLISH:
		    // 		result = "publish";
		    // 	break;
		    	case "wds":
		    	case "srd":
		    // 	case baseObj.SRD:
		    // 	case baseObj.RESPONSE_JSON:
		    		result = "wds";
		    	break;
		        case "sync":
		            result = "default";
		        break;
		    }

		    return result;
		};

		this.getServerObjectForAction = function(actionType)
	    {
	  //   	if(self.requestType === "sync")
			// {
			// 	debugger;
			// }
	        var serverClass = self.srd.action[actionType];
	        if (!serverClass)
	        {
	        	console.warn("ShoutCall.getServerObjectForAction Did not find server class for actionType: " + actionType);
	        }
	        
	        return self.srd.server[serverClass];
	    };

	    this.getServerMethod = function()
	    {
	    	// debugger;
	    	return self.method;
	    };

	    this.getRequestContentType = function()
	    {
	    	// debugger;
	    	return self.contentType;
	    };

	    this.serverReturnType = function()
	    {
	    	// debugger;
	    	return self.dataType;
	    };

	    this.getTimeout = function()
	    {
	    	// debugger;
	    	// retry = retry || 0;
	    	return self.timeout;
	    };

	    this.getDontSendRequestParams = function()
	    {
	    	// switch(requestType)
	    	// {
		    // 	case baseObj.RESPONSE_JSON:
		    // 	case baseObj.WDS:
		    // 		rtn = true;
		    // 	break;
		    // }
	    	return self.dontSendRequestParams;
	    };

	    this.formatRequestDataForServer = function(params)
	    {
	    	// debugger; // TODO Check required - TODO CHECK Allowed 
	    	params = params || {};
	    	var data = {};
	    	if(!self.dontSendRequestParams)
	    	{
	    		data = params;
	    	}
	    	
	    	switch(self.requestType)
	    	{
	    		case "publish":
	    			data.toWds = self.getToWds();
		    	break;
		    	
		    }
	    	return data;
	    };

	    this.getDontSendHeaders = function()
	    {
	    	// var rtn = !self.sendHeaders;
	    	// switch(requestType)
	    	// {
	    	// 	case baseObj.SRD:
	    	// 	case baseObj.WDS:
	    	// 	case baseObj.RESPONSE_JSON:
	    	// 		rtn = true;
	    	// 	break;
	    	// 	default:
	    	// 		rtn = false;
	    	// 	break;
	    	// }
	    	return !self.sendHeaders;
	    };

	    this.getResponseHeaders = function(requestType, getDontSendHeaders)
	    {
	    	requestType = requestType || self.requestType;
	    	var headerParams = null; 
	    	var dontSendHeaderParams = getDontSendHeaders || self.getDontSendHeaders();
	        
	        if (!dontSendHeaderParams)
	        {
				headerParams = {};
				switch(requestType)
				{
					case "sync":
					case "publish":
					case "auth":
						if(self.subscriber)
			            {
		                	if (self.subscriber.sessionKey){
		                    	headerParams["X-REST-SESSION-KEY"] = self.subscriber.sessionKey;
		                	}

		                	var deviceId = getDeviceId();
		                	if (deviceId){
		                    	headerParams["X-REST-DEVICE-ID"] = deviceId;
		                	}
		            	}
		            
		            	headerParams["X-REST-APPLICATION-ID"] = "SHOUT_HTML5_EMBEDDED";
		            	headerParams["X-REST-APPLICATION-VERSION"] = "4.9";

		            	if (requestType === "ADD_ANSWER"){
		                	headerParams["X-MESSAGE-TYPE"] = "ADD_ANSWER";
		            	}
					break;
				}
	        }
	        return headerParams;

	    };



	    this.deserializeFromServer = function(response) // requestData
		{
			var result = null;
			switch(self.requestType)
			{
				case "srd":
					if(!response.action)
					{
						response.action = {};
						response.action.wds = "wds";
						response.action.publish = "collector";
					}

					if(!response.action.wds)
					{
						response.action.wds = "wds";
						response.action.publish = "collector";
					}
					result = response; 
				break;
				case "wds":
					if(typeof(response) === "object")
					{
						result = response;
					}
					else
					{
						result = self.decryptSyncDoc(self.subscriber.encryptKey, response);
					}
					
				break;
				default:
					result = response;
				break;
			}
			//TODO HANDLE ERRORS
			return result;
		};

		this.decryptSyncDoc = function(encryptKey, syncDocEncrypted)
		{
			
		    var responseWords = CryptoJS.enc.Base64.parse(syncDocEncrypted);
		    var ivWords = CryptoJS.lib.WordArray.create(responseWords.words.slice(0,4));
		    var secretWords = CryptoJS.lib.WordArray.create(responseWords.words.slice(4), responseWords.sigBytes-16);
		    var decoded = null;
		    try
		    {
		    	decoded = decodeURIComponent(encryptKey);
		    }
		    catch(e)
		    {
		    	decoded = encryptKey;
		    }
		     
		    var hash = self.getSha256Hash(decoded)
		    var keyWords = CryptoJS.enc.Hex.parse(hash);

		    // See https://code.google.com/p/crypto-js/issues/detail?id=112
		    var decrypted = CryptoJS.AES.decrypt(secretWords.toString(CryptoJS.enc.Base64), keyWords, {iv: ivWords});
		    var strResult = decrypted.toString(CryptoJS.enc.Latin1);
		    var result = null;
		    
		    if (isNotEmpty(strResult))
		    {
		        try
		        {
		            result = JSON.parse(strResult);
		        }
		        catch(ex)
		        {
		            console.error("Subscriber.decryptSyncDoc Unable to parse decrypted JSON for request type " + self.requestType + ", decryptedData: " + strResult + ", exception - " + ex);
		            result = ErrorHandler.createServerError({errorType: "jsonParseException"});
		        }
		    }

		    return result;
		};

		this.getSha256Hash = function(value)
		{
		    var message = CryptoJS.enc.Utf8.parse(value);
		    var digest = CryptoJS.SHA256(message);
		    return digest.toString();
		};

	    this.getDomainNameSetForUrl = function(serverObj, actionType, primaryId)
	    {
	    	var domainNameSets = serverObj.domainNameSets;
	        if (isEmpty(domainNameSets))
	            console.warn("ShoutCall.getDomainNameSetForUrl Did not find domainNameSets for serverClass: " + serverClass);
	        
	        // If there is no selected domainNameSet or the email changed then reselect one.
	        if( primaryId && (isEmpty(serverObj.domainNameSetIndex) || serverObj.subscriberEmail !== primaryId))
	        {
	            serverObj.subscriberEmail = primaryId;
	            
	            var selectMethodArr = serverObj.selectMethod.split("%");
	            var selectMethod = selectMethodArr[0];
	            if (selectMethod !== "sha256")
	                return {error: "Unknown selectMethod " + selectMethod + " found while getting url for action : " + actionType};

	            var howManyBytesToUse = myParseInt(selectMethodArr[1]);
	            var byteValueAsLong = getByteValueFromEmailUsingSha256A( self.emailSha256Hash || serverObj.subscriberEmail || serverObj.subscriberFacebookId, howManyBytesToUse);
	            
	            var lengthOfDomainNameSets = domainNameSets.length;
	            var moduloAsLong = byteValueAsLong.modulo(Long.fromNumber(lengthOfDomainNameSets));
	            serverObj.domainNameSetIndex = moduloAsLong.toInt();
	        }
	        else
	        {
	        	serverObj.domainNameSetIndex = serverObj.domainNameSetIndex || 0;
	        }

	        // We now have a domain name set index, grab that domain name set.
	        var domainNameSet = domainNameSets[serverObj.domainNameSetIndex];
	        
	        return domainNameSet;
	    };

    
	    self.getToWds = function()
		{
			var rtn = null;
			var actionType = "wds";
			var serverObj = self.getServerObjectForAction(actionType);
			var serverDomainNameSet = self.getDomainNameSetForUrl(serverObj, actionType, self.getSubscriberEmail());
			if (isEmpty(serverObj.domainNameIndex))
	            serverObj.domainNameIndex = 0;

	        rtn =  serverDomainNameSet[serverObj.domainNameIndex];

			if(rtn)
			{
				if(rtn.indexOf(":") !== -1)
				{
					rtn = rtn.substr(0, rtn.indexOf(":"));
				}
			}
			
				
			return rtn;
		};
		var getByteValueFromEmailUsingSha256A = function(email, howManyBytesToUse)
		{
		    var rtn;
		    // emailSha256Hash
			var digest;
			if(email.indexOf("@") !== -1 )
		    {
		        var message = CryptoJS.enc.Utf8.parse(email);
		        digest = CryptoJS.SHA256(message);
		    }
		    else // already encrypted
		    {
		        digest = CryptoJS.enc.Hex.parse(email);
		    }
		    var arr = wordToByteArray(digest.words);
		    
		    var byteValueAsLong = Long.fromNumber(0, false);
		    
		    for (var i = 0; i < howManyBytesToUse; i++)
		    {
		        if (i > 0) byteValueAsLong = byteValueAsLong.shiftLeft(8);
		        	byteValueAsLong = byteValueAsLong.or(Long.fromNumber(arr[i] & 0xFF, false));

		    }
		    rtn = byteValueAsLong;
		    return rtn;
		};

		var wordToByteArray = function (wordArray)
		{
		    var byteArray = [], word, i, j;
		    for (i = 0; i < wordArray.length; ++i) {
		        word = wordArray[i];
		        for (j = 3; j >= 0; --j) {
		            byteArray.push((word >> 8 * j) & 0xFF);
		        }
		    }
		    return byteArray;
		};
	    
	};



	var getTypeOf = function(value)
	{
	    var s = typeof value;

	    if (s === 'object')
	    {
	        if (value)
	        {
	            if (typeof value.length === 'number' && !(value.propertyIsEnumerable('length')) && typeof value.splice === 'function')
	            {
	                s = 'array';
	            }
	        }
	        else
	        {
	            s = 'null';
	        }
	    }

	    return s;
	};

	var myParseInt = function(val)
	{
	    return parseInt(val, 10);
	};

	var isNotEmpty = function(val)
	{
		var result = false;
	    var UNDEF;

	    if (val !== UNDEF && val !== null)
	    {
	        var type = getTypeOf(val);
	        if (type === "string")
	        {
	            result = val.trim().length > 0;
	        }
	        else if (type === "array")
	        {
	            result = val.length > 0;
	        }
	        else
	        {
	            result = true;
	        }
	    }

	    return result;
	};
	var isEmpty = function(val)
	{
	    return !isNotEmpty(val);
	};


	var RequireLite = function(name, callback) // TODO Try with various module loaders
	{
		if(window.require && typeof(window.require) === "function")
		{
			require([name], function(mods)
			{
				if(mods[name])
				{
					callback(mods[name]);
				}
				else
				{
					debugger;
				}
			});
		}
		else
		{
			switch(name)
			{
				case "Deferred":
					if(window.Deferred)
					{
						callback(window.Deferred);
					}
					else
					{
						console.error("ShoutCall Missing Deferred Object");
					}
				break;
				case "Ajax":
					if(window.ajax)
					{
						callback(window.ajax);
					}
					else
					{
						console.error("ShoutCall Missing Ajax Object");
					}
					
				break;
				case "CryptoJS":
					if(window.CryptoJS)
					{
						callback(window.CryptoJS);
					}
					else if(window.Crypto)
					{
						callback(window.Crypto);
					}
					else
					{
						console.error("ShoutCall Missing Crypto Object");
					}
				break;
				case "Long":
					
					if(window.dcodeIO.Long)
					{
						callback(window.dcodeIO.Long);
					}
					else
					{
						console.error("ShoutCall Missing Long Object");
					}
				break;
			}
		}
	};

	ShoutCall.BASE_AJAX = "/mobile_api";
	ShoutCall.HOST = window.location.host;
	ShoutCall.DEFAULT_isSsl = false;
	ShoutCall.DEFAULT_contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
	ShoutCall.DEFAULT_dataType = "json";
	ShoutCall.DEFAULT_timeout = 10000;
	ShoutCall.DEFAULT_getDontSendRequestParams = false;
	ShoutCall.DEFAULT_cache = true;
	ShoutCall.DEFAULT_method = "GET";
	ShoutCall.DEFAULT_sendHeaders = false;
	ShoutCall.serverType === "PRODUCTION";

	ShoutCall.Factory = {
		getWDSCall: function(serverUri, callbackOnUpdate, isSRD)
		{
			var wdsData = {
				host: ShoutCall.serverType === "PRODUCTION" ? "static.shout.tv" : "dc1-static.shoutgameplay.com",
				baseAjax: "/",
				serverUri: serverUri, // "srd2.json"
				requestType: isSRD ? "srd" : "wds",
				dontSendRequestParams: true,
				callback: callbackOnUpdate
			};
			return new ShoutCall(wdsData);
		},
		getAuthCall: function(serverUri, callbackOnUpdate)
		{
			var authData = {
				baseAjax: "/gpwebapi",
				serverUri: serverUri,
				requestType: "signin",
				sendHeaders: true,
				method: "POST",
				ssl: true,
				callback: callbackOnUpdate
			};
			return new ShoutCall(authData);
		},
		getPublishCall: function(serverUri, callbackOnUpdate)
		{
			var publishData = {
				baseAjax: "/",
				serverUri: serverUri || "publish",
				requestType: "publish",
				sendHeaders: true,
				method: "POST",
				ssl: true,
				callback: callbackOnUpdate
			};
			return new ShoutCall(publishData);
		},
		getSyncCall: function(serverUri, callbackOnUpdate)
		{
			var syncData = {
				baseAjax: "/gpwebapi",
				serverUri: serverUri,
				requestType: "sync",
				sendHeaders: true,
				ssl: false,
				callback: callbackOnUpdate
			};
			return new ShoutCall(syncData);
		}
	};

	var saveToLocal = function(key, value)
	{
	    if (typeof(Storage) !== "undefined") {
	        localStorage.setItem(key, value);
	    }
	};


	window.getDeviceId = function()
	{
	    var rtn = null;
	    if (typeof(Storage) !== "undefined") {
	        rtn = localStorage.getItem("deviceId");
	    }
	    if(!rtn)
	    {
	        rtn = getUuid();
	        saveToLocal("deviceId", rtn);
	    }
	    return rtn;
	}; 

	var getUuid = function ()
	{
	    var d = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (d + Math.random()*16)%16 | 0;
	        d = Math.floor(d/16);
	        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
	    });
	    return uuid;
	};

	var Cron = function(pulseTime, callback)
	{
		var self = this;
		var run = false;
		this.pulseTime = pulseTime;
		this.callback = callback;
		this.start = function()
		{
			run = true;
			cron();
		};

		this.stop = function()
		{
			run = false;
		};

		var cron = function()
		{
			if(run && self.pulseTime && self.pulseTime > 0 && self.callback && typeof(self.callback) === "function")
			{
				window.setTimeout(function()
				{
					self.callback();
					cron();
				}, self.pulseTime);
			}
		};
	};
	/**
	 * API to access SHOUT servers.
	 * @class ShoutPortal
	 */

	/**
	 * Initiates a ShoutPortal Object
	 * @memberof ShoutPortal
	 * @param {string} appId - Possible values of "SHOUT", "SHOUT5", "MyMadrid"
	 * @param {string} appMode - Possible values null, "STAND_ALONE", "EMBEDDED", will default to "STAND_ALONE"
	 * @param {string} appMode - Possible values null, "PRODUCTION", "STAGING", will default to "PRODUCTION"
	 */
	var ShoutPortal = function(appId, appMode, serverType)
	{
		var self = this;
		var Deferred = null;
		RequireLite("Deferred", function(result)
		{
			Deferred = result;
		});
		this.ShoutCall = ShoutCall;

		this.appId = appId || "SHOUT";
		this.appMode = appMode || "STAND_ALONE";
		ShoutCall.serverType = serverType ? serverType === "PRODUCTION" || serverType === "STAGING" ? serverType : "PRODUCTION" : "PRODUCTION";

		console.info("ShoutPortal");
		var srdUpdate = [];
		var subscriberUpdate = [];
		var srd = null;
		this.registerCall = function(call)
		{
			srdUpdate.push(call);
			subscriberUpdate.push(call);
		};
		var srdDone = function(data)
		{
			// assign result data to the srd object
			srd = data;
			var len = srdUpdate.length;
			for(var i=0;i<len;i++)
			{
				srdUpdate[i].srd = data;
			}
			console.info("SRD DONE");
		};
		var subscriberDone = function(data)
		{
			var len = subscriberUpdate.length;
			for(var i=0;i<len;i++)
			{
				subscriberUpdate[i].subscriber = data;
			}
			console.info("Subscriber DONE");
		};
		// Initailize the SRD
		var SRD = ShoutCall.Factory.getWDSCall("srd2.json", srdDone, true);
		srdUpdate.push(SRD);

		SRD.serverCall();
		var SRDcron = new Cron(180000, SRD.serverCall);
		SRDcron.start();
		
		var Stadium = ShoutCall.Factory.getWDSCall(function(){
			return srd.data.virtualStadium[self.appId].path;
		});
		srdUpdate.push(Stadium);

		var Section = ShoutCall.Factory.getWDSCall(function(data)
		{
	        var subscriberEmailHash = null;
	        var length = null;
	        var sectionNum = null;
	        try 
	        {
	            subscriberEmailHash = this.getSha256Hash(data.data.email.toLowerCase() || data.data.facebookId);
	        }
	        catch(e)
	        {
	            console.warn("SubscriberCall.serverUri VS_SECTION subscriberEmailHash error");
	        }

	        try 
	        {
	            length = data.stadium.sectionEmailHashMethod.split("/")[1];
	        }
	        catch(e)
	        {
	            console.warn("SubscriberCall.serverUri VS_SECTION length error");
	        }

	        try 
	        {
	            sectionNum = subscriberEmailHash.substring(0,parseInt(length));
	        }
	        catch(e)
	        {
	            console.warn("SubscriberCall.serverUri VS_SECTION sectionNum error");
	        }
	        
	        return "/" + sectionNum + data.stadium.sectionPathSuffix;   
    
		});
		srdUpdate.push(Section);

		// /authenticate/viaFacebookOrLink
		var authenticateViaFacebookOrLink = ShoutCall.Factory.getAuthCall("/authenticate/viaFacebookOrLink", subscriberDone);
		authenticateViaFacebookOrLink.deserializeFromServer = function(response)
		{
			response.subscriber.sessionKey = response.sessionKey;
			return response.subscriber;
		};
		srdUpdate.push(authenticateViaFacebookOrLink);

		var authenticate = ShoutCall.Factory.getAuthCall("/authenticate", subscriberDone);
		authenticate.deserializeFromServer = function(response)
		{
			response.subscriber.sessionKey = response.sessionKey;
			return response.subscriber;
		};
		srdUpdate.push(authenticate);

		var loginAndGetCommonSubscriber = ShoutCall.Factory.getPublishCall("loginAndGetCommonSubscriber");
		srdUpdate.push(loginAndGetCommonSubscriber);

		// getCommonSubscriber is Depecated use loginAndGetCommonSubscriber
		var getCommonSubscriber = ShoutCall.Factory.getPublishCall("getCommonSubscriber");
		srdUpdate.push(getCommonSubscriber);
		subscriberUpdate.push(getCommonSubscriber);
		// getCommonSubscriberJSON
		this.getResponseJSON = ShoutCall.Factory.getWDSCall(function(data)
		{
			return data.ticket+"/response.json";
		});
		this.registerCall(this.getResponseJSON);

		this.publish = ShoutCall.Factory.getPublishCall("publish");
		this.registerCall(this.publish);

		var setCommonSubscriber = ShoutCall.Factory.getPublishCall("setCommonSubscriber");
		this.registerCall(setCommonSubscriber);

		var getAllItems = ShoutCall.Factory.getPublishCall("getStoreItemsForVenue");
		this.registerCall(getAllItems);

		var getClientToken = ShoutCall.Factory.getPublishCall("getStoreClientToken");
		this.registerCall(getClientToken);

		var purchaseItem = ShoutCall.Factory.getPublishCall("purchaseStoreItem");
		this.registerCall(purchaseItem);

		var getStoreReceiptsFromDate = ShoutCall.Factory.getPublishCall("getStoreReceiptsFromDate");
		this.registerCall(getStoreReceiptsFromDate);
		
		/**
		 * Logs user in with Facebook credentials
		 * @memberof ShoutPortal
		 * @param  {Object} data - Should be the user JSON from a Facebook login 
		 * @return {Object} Deferred instance
		 */
		this.loginWithFacebook = function(data)
		{
			var deferred = new Deferred();
			if(!srd)
			{
				window.setTimeout(function()
				{
					self.loginWithFacebook().done(deferred.resolve).fail(deferred.reject);
				}, 100)
			}
			else
			{
				getStadium(data).done(function(result)
				{
					authenticateViaFacebookOrLink.serverCall(subscriberDataForServerCall(data)).done(deferred.resolve).fail(deferred.reject);
				}).fail(deferred.reject);
			}
				
			return deferred.promise();
		};

		var getStadium = function(data)
		{
			var deferred = new Deferred();
			Stadium.serverCall().done(function(result)
			{
				getSection(result, data).done(deferred.resolve).fail(deferred.reject);
			}).fail(deferred.reject);
			return deferred.promise();
		};

		var getSection = function(stadium, data)
		{
			var section = {stadium: stadium, data: data};
			var deferred = new Deferred();
			Section.serverCall(section).done(function(result)
			{
				if(result.reservations && result.reservations.length > 0)
				{
					var found = false;
					var subscriberEmailHash = Section.getSha256Hash(data.email.toLowerCase() || data.facebookId);
					var len = result.reservations.length;
					for(var i=0;i<len;i++)
					{
						if(subscriberEmailHash === result.reservations[i])
						{
							found = true;
							break;
						}
					}
					if(found)
					{
						deferred.resolve({found: found});
					}
					else
					{
						debugger;
						deferred.reject({found: found});
					}
				}	
				else
				{
					debugger;
					deferred.reject({found: false});
				}
			}).fail(deferred.reject);
			return deferred.promise();
		};

		var subscriberDataForServerCall = function(subscriber)
        {
            var systemDetect = new SystemDetect();
            var data = subscriber;
            var FACEBOOK_APPID = null;

            data.appId = self.appId;
            data.deviceId = getDeviceId();
            data.applicationId = "SHOUT_HTML5_EMBEDDED";
            data.applicationVersion = "4.9";
            data.deviceModel = systemDetect.browser || systemDetect.os;
            data.deviceName = systemDetect.os || systemDetect.browser || "BROWSER";
            data.deviceVersion = systemDetect.version || null;
            data.deviceOsName = systemDetect.os || systemDetect.mobileDevice || null;
            data.deviceOsType = systemDetect.os || systemDetect.browser || null;

            if(subscriber.email)
            {
                data.email = subscriber.email;
                data.email = data.email.toLowerCase();
            }

            if(subscriber.emailHash)
                data.emailHash = subscriber.emailHash;
            else if(data.email || data.facebookId)
            {
                data.emailHash = Section.getSha256Hash(data.email.toLowerCase() || data.facebookId);
            }

            if(subscriber.emailSignature)
                data.emailSignature = subscriber.emailSignature;

            if(subscriber.username)
            {
                data.nickname = subscriber.username;
            }

            if(subscriber.password)
            {
                data.passwd = subscriber.password;
            }
            if(subscriber.accessToken && subscriber.facebookId)
            {
                data.fbAccessToken = subscriber.accessToken;

                if(self.appId === "MyMadrid" && self.appMode === "EMBEDDED")
                {
                    FACEBOOK_APPID = 233169016830819;
                }
                else
                {
                    FACEBOOK_APPID = 110374572379171;
                }

                data.facebookAppId = FACEBOOK_APPID || null;
            }

            if(subscriber.countryCode)
                data.fromCountryCode = subscriber.countryCode;

            if(subscriber.countryCode)
                data.shipCountryCode = subscriber.countryCode;
            return data;
        };

        /**
		 * Used by clients to fetch an encrypted subscriber payload for delivery to a foreign host.
		 * Depecated use loginAndGetCommonSubscriber
		 *
		 * @memberof ShoutPortal
		 * @return {Object} Deferred instance
		 */
        this.getCommonSubscriber = function(data)
        {
        	console.warn("getCommonSubscriber is Deprecated and may not function. Please use loginAndGetCommonSubscriber");
        	var deferred = new Deferred();

        	getCommonSubscriber.serverCall().done(function(result){
        		if(result.estimatedWaitTime)
        		{
        			window.setTimeout(function()
	        		{
	        			getResponseJSON.serverCall(result).done(function(response)
	        			{
	        				deferred.resolve(response.payload);
	        			}).fail(deferred.reject);
	        		}, result.estimatedWaitTime);
        		}
        		else
        		{
        			deferred.reject(result);
        		}
	        		
        		
        	}).fail(deferred.reject);
        	return deferred.promise();
        };

        /**
		 * Used by host systems to delivery a common subscriber object to a foreign host for the purposes of synchronizing subscribers.
		 *
		 * @memberof ShoutPortal
		 * @param  {Object} data JSON of subscriber object
		 * @return {Object} Deferred instance
		 */
        this.setCommonSubscriber = function(data)
        {
        	var deferred = new Deferred();
        	setCommonSubscriber.serverCall(data).done(deferred.resolve).fail(deferred.reject);
        	return deferred.promise();
        };

        /**
		 * Logs user in with email and password 
		 *
		 * @memberof ShoutPortal
		 * @param  {Object} data JSON with email and password variables
		 * @return {Object} Deferred instance resolves subscriber and common subscriber payload 
		 */
        this.loginAndGetCommonSubscriber = function(data)
        {
        	var deferred = new Deferred();
			if(!srd)
			{
				console.log("NoSRD");
				window.setTimeout(function()
				{
					self.loginAndGetCommonSubscriber(data).done(deferred.resolve).fail(deferred.reject);
				}, 250)
			}
			else if(data.email && data.password)
			{
				loginAndGetCommonSubscriber.serverCall(subscriberDataForServerCall(data)).done(function(result)
				{
					if(result.estimatedWaitTime)
	        		{
	        			window.setTimeout(function()
		        		{
		        			self.getResponseJSON.serverCall(result).done(function(response)
		        			{
		        				if(response.success === true && response.sessionKey)
		        				{
		        					response.subscriber.sessionKey = response.sessionKey;
		        					subscriberDone(response.subscriber);
		        					deferred.resolve(response);
		        				}
		        				else
		        				{
		        					deferred.reject(response);
		        				}
		        			}).fail(deferred.reject);
		        		}, result.estimatedWaitTime);
	        		}
	        		else
	        		{
	        			deferred.reject(result);
	        		}
				}).fail(function(errorObj)
				{
					deferred.reject(errorObj);
				});
			}
			else
			{
				deferred.reject({errorType: "NOT_ENOUGH_INFO", message: "Missing email or password"});
			}

			return deferred.promise();
        };

		/**
		 * Logs user in with email and password
		 *
		 * @memberof ShoutPortal
		 * @param  {Object} data JSON with email and password variables
		 * @return {Object} Deferred instance
		 */
		this.loginWithPassword = function(data)
		{
			var deferred = new Deferred();
			if(!srd)
			{
				console.log("NoSRD");
				window.setTimeout(function()
				{
					self.loginWithPassword(data).done(deferred.resolve).fail(deferred.reject);
				}, 100)
			}
			else if(data.email && data.password)
			{
				authenticate.serverCall(subscriberDataForServerCall(data)).done(function(result)
				{
					deferred.resolve(result);
				}).fail(function(errorObj)
				{
					deferred.reject(errorObj);
				});
			}
			else
			{
				deferred.reject({errorType: "NOT_ENOUGH_INFO", message: "Missing email or password"});
			}

			return deferred.promise();
		};

		/**
		 * Returns a list of purchasable Items.
		 *
		 * @memberof ShoutPortal
		 * @param  {Object} data JSON with venue variable, venue is not required.
		 * @return {Object} Deferred instance
		 */
		this.getAllItems = function(data)
		{
			data = data || {};
			var deferred = new Deferred();
			data.venue = data.venue || "com.shout.dailymillionaire";
			getAllItems.serverCall(data).done(function(result)
			{
				if(result.estimatedWaitTime)
        		{
        			window.setTimeout(function()
	        		{
	        			self.getResponseJSON.serverCall(result).done(function(response)
	        			{
	        				deferred.resolve(response.items);
	        			}).fail(deferred.reject);
	        		}, result.estimatedWaitTime);
        		}
        		else
        		{
        			deferred.reject(result);
        		}
			}).fail(deferred.reject);
			return deferred.promise();
		};

		/**
		 * Returns a One Time Use Client Token for Braintree.
		 *
		 * @memberof ShoutPortal
		 * @return {Object} Deferred instance
		 */
		this.getClientToken = function(data)
		{
			data = data || {};
			var deferred = new Deferred();
			getClientToken.serverCall(data).done(function(result)
			{
				if(result.estimatedWaitTime)
        		{
        			window.setTimeout(function()
	        		{
	        			self.getResponseJSON.serverCall(result).done(function(response)
	        			{
	        				deferred.resolve(response.token);
	        			}).fail(deferred.reject);
	        		}, result.estimatedWaitTime);
        		}
        		else
        		{
        			deferred.reject(result);
        		}
			}).fail(deferred.reject);
			return deferred.promise();
		};
		/**
		 * Returns a list of purchasable Items.
		 *
		 * @memberof ShoutPortal
		 * @param  {String} itemUuid of item being purchased.
		 * @param  {String} nonce from Braintree.
		 * @return {Object} Deferred instance
		 */
		this.purchaseItem = function(itemUuid, nonce)
		{
			var deferred = new Deferred();
			if(itemUuid && nonce)
			{
				purchaseItem.serverCall({itemUuid: itemUuid, nonce: nonce}).done(function(result)
				{
					if(result.estimatedWaitTime)
	        		{
	        			window.setTimeout(function()
		        		{
		        			self.getResponseJSON.serverCall(result).done(function(response)
		        			{
		        				if(response.success === true && response.receipt)
		        				{
		        					deferred.resolve(response.receipt);
		        				}
		        				else
		        				{
		        					deferred.reject(response);
		        				}
		        			}).fail(deferred.reject);
		        		}, result.estimatedWaitTime);
	        		}
	        		else
	        		{
	        			deferred.reject(result);
	        		}
				}).fail(deferred.reject);
			}
			else
			{
				deferred.reject({errorType: "NOT_ENOUGH_INFO"});
			}
			return deferred.promise();
		};
		/**
		 * Returns a list of Receipts from a date.
		 *
		 * @memberof ShoutPortal
		 * @param  {String} subscriberId of Shout Subscriber.
		 * @param  {String} lastKnownPaymentReceiptTimestamp  [[ string, date time string, yyyy-MM-dd HH:mm:ss ]].
		 * @return {Object} Deferred instance
		 */
		this.getStoreReceiptsFromDate = function(lastKnownPaymentReceiptTimestamp)
		{
			var deferred = new Deferred();
			return deferred.promise();
		};

		this.getNotices = function(data)
		{

		};

		this.loginEmbedded = function(data)
		{

		};
	};

	if ( typeof exports !== "undefined" ) {
	    module.exports = ShoutPortal;
	}
	else if ( typeof define === "function" ) {
	    define("com.component.ShoutPortal", ShoutPortal);
	}
	else {
	    window.ShoutPortal = ShoutPortal;
	}

} )( this );




//# sourceURL=/modules/com/component/ShoutPortal.js
