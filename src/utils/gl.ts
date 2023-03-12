interface shaderInfo {
    vertexShader: string;
    fragmentShader: string;
}
export const fluid = {
    fragmentShader: `
            uniform vec2 resolution;
            uniform float time;
            void main()	{
                vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
                float a = time*40.0;
                float d,e,f,g=1.0/40.0,h,i,r,q;
                e=400.0*(p.x*0.5+0.5);
                f=400.0*(p.y*0.5+0.5);
                i=200.0+sin(e*g+a/150.0)*20.0;
                d=200.0+cos(f*g/2.0)*18.0+cos(e*g)*7.0;
                r=sqrt(pow(abs(i-e),2.0)+pow(abs(d-f),2.0));
                q=f/r;
                e=(r*cos(q))-a/2.0;f=(r*sin(q))-a/2.0;
                d=sin(e*g)*176.0+sin(e*g)*164.0+r;
                h=((f+d)+a/2.0)*g;
                i=cos(h+r*p.x/1.3)*(e+e+a)+cos(q*g*6.0)*(r+h/3.0);
                h=sin(f*g)*144.0-sin(e*g)*212.0*p.x;
                h=(h+(f-e)*q+sin(r-(a+h)/7.0)*10.0+i/4.0)*g;
                i+=cos(h*2.3*sin(a/350.0-q))*184.0*sin(q-(r*4.3+a/12.0)*g)+tan(r*g+h)*184.0*cos(r*g+h);
                i=mod(i/5.6,256.0)/64.0;
                if(i<0.0) i+=4.0;
                if(i>=2.0) i=4.0-i;
                d=r/350.0;
                d+=sin(d*d*8.0)*0.52;
                f=(sin(a*g)+1.0)/2.0;
                gl_FragColor=vec4(vec3(f*i/1.6,i/2.0+d/13.0,i)*d*p.x+vec3(i/1.3+d/8.0,i/2.0+d/18.0,i)*d*(1.0-p.x),1.0);
            }
        `,
    fragmentShader1: `
        uniform float uTime;
        varying vec2 vUv;

        vec3 background(vec2 uv){
            float dist=length(uv-vec2(.5));
            vec3 bg=mix(vec3(.3),vec3(.0),dist);
            return bg;
        }

        void main(){
            vec3 bg=background(vUv);
            vec3 color=bg;

            gl_FragColor=vec4(color,1.);
        }
    `,
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main(){
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
            
            vUv=uv;
            vPosition=position;
        }
    `
};

export const box1: shaderInfo = {
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vP;
        void main() {
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
            vUv = uv;
            vP = position;
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        vec3 background(vec2 uv) {
            float dist = length(uv-vec2(.5));
            vec3 bg = mix(vec3(1.,0,0),vec3(.0),dist);
            return bg;
        }
        void main() {
            vec3 bg = background(vUv);
            vec3 color = bg;
            gl_FragColor = vec4(color,1.);
        }
    `
};

export const box: shaderInfo = {
    vertexShader: `
    varying vec2 vUv;
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vUv = uv;
    }
    `,
    // 需要模拟二维平面上旋转3D立方体
    // 首先变化uv坐标 以中点为圆心
    // 其次模拟出立方体, 并且通过立方体的距离场函数结合入射点 算出中点到 [(入射点 -> uv坐标)和立方体交点]的距离
    // 通过循环步进 将可到达的uv坐标点渲染出与距离相关的颜色
    fragmentShader: `
    varying vec2 vUv;
    uniform float time;
    uniform vec2 resolution;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    float sdBox(vec3 p, vec3 b) {
        vec3 d = abs(p) - b;
        return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
    }

    mat4 rotationMatrix(vec3 axis,float angle){
        axis=normalize(axis);
        float s=sin(angle);
        float c=cos(angle);
        float oc=1.-c;
  
        return mat4(oc*axis.x*axis.x+c,oc*axis.x*axis.y-axis.z*s,oc*axis.z*axis.x+axis.y*s,0.,
            oc*axis.x*axis.y+axis.z*s,oc*axis.y*axis.y+c,oc*axis.y*axis.z-axis.x*s,0.,
            oc*axis.z*axis.x-axis.y*s,oc*axis.y*axis.z+axis.x*s,oc*axis.z*axis.z+c,0.,
        0.,0.,0.,1.);
    }

    vec3 rotate(vec3 v,vec3 axis,float angle){
        mat4 m=rotationMatrix(axis,angle);
        return(m*vec4(v,1.)).xyz;
    }

    float rayMarch(vec3 ro,vec3 rd,float end,int maxIter){
        float d0 = 0.;
        for(int i=0;i<maxIter;i++){
            vec3 pos=ro+d0*rd;
            // 旋转沿uv方向的向量
            // 从而不断改变沿rd入射距离
            vec3 p1=rotate(pos,vec3(1.),time);
            // 这里作为阈值在限制步进
            float ds=sdBox(p1,vec3(.3));
            d0+=ds;
            if(ds >= end || ds < 0.01){
                break;
            }
        }
        return d0;
    }

    vec2 centerUv(vec2 uv){
        uv=2.*uv-1.;
        return uv;
    }
    

    void main() {
        vec3 eye = vec3(0.,0.,2.5);
        // 方向
        vec2 cUv=centerUv(vUv);
        vec3 ray=normalize(vec3(cUv,-eye.z));
        // 最大距离
        float end = 5.;
        // 最大步数
        int maxIter=256;
        // 计算从入射点沿uv坐标的向量 和 体积为.3长宽高立方体的交点
        float depth = rayMarch(eye,ray,end,maxIter);
        vec3 color = vec3(.3);
        if(depth < end){
            // 模拟计算出圆点到指定uv位置的距离
            vec3 pos = eye + depth * ray;
            color = pos;
        }
        gl_FragColor=vec4(color, 1.);
    }
    `
};
