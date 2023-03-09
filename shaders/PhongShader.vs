precision mediump float;
#define eyePosition vec3(0,0,0)
#define lightPos vec3(0,0.2,0)
attribute vec3 aPosition;
attribute vec2 aTextureCoordinate;
attribute vec3 aNormal;

uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uTransposeInverseWorldMatrix;
uniform mat4 uProjMatrix;

varying vec2 vTextureCoordinate;
varying vec3 vNormal;
varying vec3 vEyeVec;
varying vec3 vLightDirection;


void main(void)
{
     vTextureCoordinate = aTextureCoordinate;

     //Transformed vertex position
     vec4 vertex = uWorldMatrix * vec4(aPosition, 1.0);

     //Transformed normal position
     vNormal = vec3(uTransposeInverseWorldMatrix * vec4(aNormal,1));

     //Transform the light position
     vec3 light = (uViewMatrix*vec4(lightPos,1.0)).xyz;
	
	//uLightDirection = normalize(light + vertex.xyz);
	vLightDirection = vertex.xyz - light ;

     //Vector Eye
     vEyeVec = vec3((uWorldMatrix*vec4(eyePosition,1.0)).xyz - vertex.xyz);
     
     //Final vertex position
     gl_Position = uProjMatrix * vertex;
}
