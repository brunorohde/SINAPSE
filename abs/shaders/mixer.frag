uniform sampler2D MyTex1;
uniform sampler2D MyTex2;

varying vec2 texcoord1;
varying vec2 texcoord2;

uniform float style;
uniform float mix_factor;

void main (void)
{
	vec4 color1 = texture2D(MyTex1, texcoord1);
	vec4 color2 = texture2D(MyTex2, texcoord2); 

	if (style == 0.) {
		gl_FragColor = vec4((color1.rgb + color2.rgb), 1);
	} else if (style == 1.) {
		gl_FragColor = vec4((color1.rgb - color2.rgb), 1);
	} else if (style == 2.) {
		gl_FragColor = vec4(abs(color1.rgb - color2.rgb), 1);
	} else if (style == 3.) {
		gl_FragColor = vec4((color1.rgb * color2.rgb), 1);
	} else if (style == 4.) {
		gl_FragColor = vec4((color1.rgb / color2.rgb), 1);
	} else if (style == 5.) {
		gl_FragColor = mix(color1,color2,mix_factor);
	}

}

