import { GUI } from 'dat.gui';
import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import Stats from 'stats.js';
import {
    AmbientLight,
    AnimationMixer,
    AxesHelper,
    Clock,
    GridHelper,
    Group,
    LoopOnce,
    Material,
    Matrix4,
    MeshPhongMaterial,
    PlaneGeometry,
    Raycaster,
    ShaderMaterial,
    Vector2,
    Mesh,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Fog,
    BoxGeometry,
    Vector3
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import font0 from '../assets/font11.json?url';
import dragon from '../assets/dragon/f.fbx?url';
import { fluid, box } from '../utils/gl';

const clock = new Clock();
function Demo() {
    const canvasRef = useRef<null | HTMLCanvasElement>(null);
    const mixer = useRef<null | AnimationMixer>(null);
    const scene0 = useRef(new Scene());
    const stats = useRef(new Stats());
    const [font, setFont] = useState<null | Font>(null);
    const uniforms = useRef({
        fluid: {
            time: { type: 'f', value: 1.0 },
            resolution: {
                type: 'v2',
                value: new Vector2(window.innerWidth, window.innerHeight)
            }
        }
    });

    // 定位点击位置模型
    const initListener = useCallback(() => {
        //声明raycaster和mouse变量
        const raycaster = new Raycaster();
        const mouse = new Vector2();
        const onMouseClick = (event: MouseEvent) => {
            // 将鼠标点击位置的屏幕坐标转成threejs中的标准坐标，以屏幕中心为原点，值的范围为-1到1.
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
            raycaster.setFromCamera(mouse, camera.current);
            // 获取raycaster直线和所有模型相交的数组集合
            const intersects = raycaster.intersectObjects(
                scene0.current.children
            );
            if (intersects.length > 0) {
                // alert('HELLO WORLD');
                // 可以通过遍历实现点击不同mesh触发不同交互，如：
                const selectedObj = intersects[0].object;
                if (selectedObj.type === 'Mesh') {
                    alert(selectedObj.name);
                }
            }
        };
        window.addEventListener('click', onMouseClick, false);
    }, []);

    const camera = useRef(
        new PerspectiveCamera(
            100,
            window.innerWidth / window.innerHeight,
            0.01,
            1000
        )
    );

    const [renderer, setRenderer] = useState<null | WebGLRenderer>(null);

    const initRenderer = useCallback(() => {
        if (!renderer) return;
        renderer.setClearColor('#dfdfdf', 0.4);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
    }, [renderer]);

    const initCamera = useCallback(() => {
        if (!camera.current) return;
        camera.current.position.set(0, 50, 100);
    }, [camera.current]);

    // 创建光照
    const initLights = useCallback(() => {
        if (!scene0.current) return;
        const scene = scene0.current;

        // const light = new HemisphereLight(0xbbbbbb, 0xbbbbbb);
        // light.position.set(0, 50, 0);
        // scene.add(light);
        // scene.add(new HemisphereLightHelper(light, 2));

        // const lightDemo = new DirectionalLight(0xffffff);
        // lightDemo.position.set(0, 20, 10);
        // lightDemo.castShadow = true;
        // scene.add(lightDemo);

        const ambientLight = new AmbientLight('#0C0C0C');
        scene.add(ambientLight);
    }, [scene0.current]);

    // 渲染动画
    const animation = (
        renderer: WebGLRenderer,
        camera: PerspectiveCamera,
        scene: Scene
    ) => {
        stats.current.begin();
        renderer.render(scene, camera);
        if (mixer.current) {
            mixer.current.update(clock.getDelta());
        }
        uniforms.current.fluid.time.value += 0.05;
        const box = scene.getObjectByName('shaderBox') as Mesh;
        if (box)
            (box.material as ShaderMaterial).uniforms.time.value =
                performance.now() * 0.001;
        // box.rotateX(-Math.PI / 120);
        // box.rotateY(-Math.PI / 120);
        stats.current.end();
        requestAnimationFrame(() => animation(renderer, camera, scene));
    };

    const addAnimation = useCallback(
        (
            gui: GUI,
            name: string,
            folder: string,
            actionName: string,
            indexList?: number[]
        ) => {
            const animationList = gui.addFolder(folder);
            const scene = scene0.current;
            const group = scene.getObjectByName(name) as Group;
            const doList: Record<string, any> = {};
            const list: any[] = [];
            group.animations.forEach((animation, i) => {
                if (indexList && !indexList.includes(i)) return;
                const _animation = (mixer.current as AnimationMixer).clipAction(
                    animation
                );
                _animation.timeScale = 0.2;
                _animation.clampWhenFinished = true;
                _animation.loop = LoopOnce;
                doList['action' + i] = () => {
                    list.forEach((_, index) =>
                        index !== i ? list[index].stop() : list[index].play()
                    );
                    _animation.play();
                };
                list.push(_animation);
                animationList.add(doList, actionName + i);
            });
        },
        [scene0]
    );

    const initGui = useCallback(() => {
        const gui = new GUI();
        addAnimation(gui, 'dragon', 'animations', 'action', [3, 22]);
    }, []);

    const initGridHelp = useCallback(() => {
        const scene = scene0.current;
        const grid = new GridHelper(1000, 100, 0x000000, 0x000000);
        (grid.material as Material).opacity = 0.1;
        (grid.material as Material).transparent = true;
        grid.position.set(0, -240, 0);
        scene.add(grid);
    }, [scene0]);

    const initHelp = useCallback(() => {
        const scene = scene0.current;
        const camera0 = camera.current;
        const canvas = canvasRef.current;
        if (!scene || !camera0 || !canvas || !renderer) return;
        scene.add(new AxesHelper(200));
        scene.fog = new Fog(0xeeeeee, 0.015, 530);
        document.body.appendChild(stats.current.dom);
        const controls = new OrbitControls(camera0, canvas);
        animation(renderer, camera0, scene);
        // initGui();
        initGridHelp();
    }, [renderer]);

    const initText = useCallback(
        async (text: string) => {
            let _font = font;
            if (!font) {
                _font = await new FontLoader().loadAsync(font0);
                setFont(_font);
            }
            const textGeo = new TextGeometry(text, {
                font: _font as Font,
                size: 8,
                height: 1,
                curveSegments: 0.05,
                bevelThickness: 0.05,
                bevelSize: 0.05,
                bevelEnabled: true
            });
            const textMaterial = new MeshPhongMaterial({ color: 0x03c03c });
            const mesh = new Mesh(textGeo, textMaterial);
            return mesh;
        },
        [font]
    );

    const initModel = useCallback(async () => {
        const scene = scene0.current;
        if (!scene) return;
        // 字体解析
        const font = await new FontLoader().loadAsync(font0);
        const textGeo = new TextGeometry('3D Model', {
            font,
            size: 8,
            height: 1,
            curveSegments: 0.05,
            bevelThickness: 0.05,
            bevelSize: 0.05,
            bevelEnabled: true
        });
        const textMaterial = new MeshPhongMaterial({ color: 0x03c03c });
        const mesh = new Mesh(textGeo, textMaterial);
        mesh.position.set(0, 60, 0);
        scene.add(mesh);

        // 实物模型解析
        new FBXLoader().load(dragon, (group) => {
            const aMixer = new AnimationMixer(group);
            mixer.current = aMixer;
            group.scale.set(0.01, 0.01, 0.01);
            group.castShadow = true;
            group.receiveShadow = true;
            group.name = 'dragon';
            group.rotateY(-Math.PI / 3);
            scene.add(group);
            initGui();
        });
    }, [scene0.current]);

    const initFluid = useCallback(() => {
        const geometry = new PlaneGeometry(150, 150);
        console.log(uniforms.current, 123);

        const material = new ShaderMaterial({
            uniforms: uniforms.current,
            vertexShader: fluid.vertexShader,
            fragmentShader: fluid.fragmentShader
        });
        const mesh = new Mesh(geometry, material);
        mesh.rotateX(-Math.PI / 2);
        scene0.current.add(mesh);
    }, [scene0.current]);

    // 光线追踪
    const initShaderBox = useCallback(async () => {
        const scene = scene0.current;
        const geo = new BoxGeometry(100, 100, 100);
        const shaderMaterial = new ShaderMaterial({
            uniforms: {
                time: {
                    value: 0
                },
                resolution: {
                    value: new Vector2(window.innerWidth, window.innerHeight)
                }
            },
            fragmentShader: box.fragmentShader,
            vertexShader: box.vertexShader
        });
        const mesh = new Mesh(geo, shaderMaterial);
        mesh.name = 'shaderBox';
        const textMesh = await initText('光线追踪');
        textMesh.position.set(0, 100, 0);
        scene.add(textMesh);
        scene.add(mesh);
    }, [scene0.current]);

    const init = useCallback(() => {
        if (
            !canvasRef.current ||
            !renderer ||
            !camera.current ||
            !scene0.current
        )
            return;
        initRenderer();
        initCamera();
        initLights();

        initModel();
        // initFluid();
        // initShaderBox();

        initHelp();
        initListener();
    }, [renderer, camera.current, canvasRef.current, scene0.current]);

    useEffect(() => {
        if (!canvasRef.current) return;
        if (renderer) init();
        else {
            setRenderer(
                new WebGLRenderer({
                    canvas: canvasRef.current as HTMLCanvasElement
                })
            );
        }
    }, [renderer]);

    return (
        <div>
            <div onClick={() => {}} className="title-list">
                获取model数据和源码
            </div>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}
export default Demo;
