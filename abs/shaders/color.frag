// ARRAST_VJ Shaders - por brunorohde
// github.com/brunorohde/ARRAST_VJ

// HSB baseado nos conversores encontrados em:
// https://stackoverflow.com/questions/15095909/from-rgb-to-hsv-in-opengl-glsl


uniform float hue = 0.0;
uniform float saturation = 1.0;
uniform float brightness = 1.0;
uniform float contrast = 1.0;
uniform float invert = 0.0;

uniform sampler2D uImageUnit;

// Conversor RGB para HSB
vec3 rgb2hsb(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// Conversor HSB para RGB
vec3 hsb2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(){
  vec2 texcoord = (gl_TextureMatrix[0] * gl_TexCoord[0]).st;  // define coordenada na textura
  vec4 icolor = texture2D(uImageUnit, texcoord);              // obtém dados do texel na coordenada
  // HSB
  vec3 irgb = icolor.rgb;
  vec3 ihsv = rgb2hsb(irgb);                      // converte cor de entrada para HSB
  ihsv.x += hue;                                  // aplica hue shifting
  if (ihsv.x > 1.0)   ihsv.x -= 1.0;              // restringe shift entre 0-1
  if (ihsv.x < 0.0)   ihsv.x += 1.0;
  ihsv.y *= saturation;                           // aplica saturação
  ihsv.z *= brightness;                           // aplica ganho/brilho
  irgb = hsb2rgb(ihsv);                           // converte cor novamente para RGB
  // Contraste
  vec3 gray = vec3(0.5,0.5,0.5);                  // define vetor cinza
  vec3 contr = vec3(mix(gray, irgb, contrast));   // aplica contraste
  vec3 inv = vec3(1.0, 1.0, 1.0) - contr;	  // inverte cores
  vec4 ocolor = vec4(mix(contr, inv, invert), icolor.a);     // cor de saída do texel (mix entre original pós efeitos e seu inverso)
  gl_FragColor = ocolor;
}
