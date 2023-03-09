precision mediump float; //this was changed
#define uAmbientCoeff vec4(0.2,0.2,0.2,1)
#define uDiffuseCoeff vec4(0.5,0.5,0.5,1)
#define uSpecularCoeff vec4(0.8,0.8,0.8,1)
#define uShininess 5.0

uniform vec4 uLightAmbient; //this was changed
uniform vec4 uLightDiffuse; //this was changed
uniform vec4 uLightSpecular; //this was changed

varying highp vec2 vTextureCoordinate;
varying vec3 vNormal;
varying vec3 vEyeVec;
varying vec3 vLightDirection;
uniform sampler2D myTexture;


void main(void)  
{     
	vec3 L = normalize(vLightDirection);
     vec3 N = normalize(vNormal);
     
     //Lambert's cosine law
     float lambertTerm = dot(N,-L);
     
     //Ambient Term
     vec4 Ia = uAmbientCoeff * uLightAmbient ;
     
     //Diffuse Term
     vec4 Id = vec4(0.0,0.0,0.0,1.0);
     
     //Specular Term
     vec4 Is = vec4(0.0,0.0,0.0,1.0);
     
     if(lambertTerm > 0.0) //only if lambertTerm is positive
     {
          Id = uDiffuseCoeff * uLightDiffuse * lambertTerm; //add diffuse term
          
          vec3 E = normalize(vEyeVec);
          vec3 R = reflect(L, N);

          float specular = pow(max(dot(R, E), 0.0), uShininess);
          
          Is = uSpecularCoeff * uLightSpecular * specular; //add specular term 
     }
     
     //Final color
     vec4 finalColor = Ia + Id + Is;
     finalColor.a = 1.0;

     vec4 textureColor = texture2D(myTexture, vTextureCoordinate) ;
     
     gl_FragColor = vec4(textureColor.rgb * (Ia+Id).rgb + Is.rgb, textureColor.a);
} 