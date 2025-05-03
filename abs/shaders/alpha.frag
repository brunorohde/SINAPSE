// ARRAST_VJ Shaders - por brunorohde
// github.com/brunorohde/ARRAST_VJ

// Controle de alpha com função similar ao [pix_alpha] do Gem + chromakey

// Referência para chromakey:
// https://stackoverflow.com/questions/60767805/chromakey-glsl-shader-with-transparent-background


const vec3 W = vec3(0.2125, 0.7154, 0.0721); // vetor constante de pesos (Weight) para cálculo da luminância

uniform vec4 keyRGBA = vec4(0.0, 0.0, 0.0, 1);    // cor chave como rgba
uniform vec2 keyCC;      // CC extraído do perfil YCC da cor chave
uniform vec2 keyRange = vec2(0.0, 0.0);      // suavização

uniform float alpha = 1.0; // alpha geral
uniform vec2 lightRange = vec2(1.0, 0.0); // faixa de corte por luminosidade

uniform sampler2D uImageUnit;

vec2 rgba2cc(vec4 rgba) {
    float Y = 0.299 * rgba.r + 0.587 * rgba.g + 0.114 * rgba.b;
    return vec2((rgba.b - Y) * 0.565, (rgba.r - Y) * 0.713);
}

void main(){

  vec4 tempcolor; // armazena rgba durante processamento

  vec2 texcoord = (gl_TextureMatrix[0] * gl_TexCoord[0]).st; // coordenada do texel
  vec4 icolor = texture2D(uImageUnit, texcoord); // rgba do texel

  // chromakey
  vec2 CC = rgba2cc(icolor);
  vec2 keyCC = rgba2cc(keyRGBA);
  float mask = sqrt(pow(keyCC.x - CC.x, 2.0) + pow(keyCC.y - CC.y, 2.0));
  mask = smoothstep(keyRange.x, keyRange.y, mask);

  if (mask == 0.0) { tempcolor = icolor; }
  else if (mask == 1.0) { tempcolor = icolor; }
  else { tempcolor = max(icolor - (1.0 - mask) * keyRGBA, 0.0); }

  // Corte por luminância
  float luminance = dot(tempcolor.rgb, W); // calcula luminância
  tempcolor.a *= step(1 - lightRange.x, 1 - luminance) * step(lightRange.y, luminance);

  // alpha geral
  alpha = clamp(alpha * tempcolor.a, 0.0, 1.0);

  vec4 ocolor = vec4(tempcolor.rgb, alpha);
  gl_FragColor = ocolor;
}
