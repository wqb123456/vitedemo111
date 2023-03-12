import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    AnimationClip,
    AnimationMixer,
    AxesHelper,
    Bone,
    BoxGeometry,
    BufferAttribute,
    Clock,
    CylinderGeometry,
    DirectionalLight,
    Float32BufferAttribute,
    Group,
    KeyframeTrack,
    LineBasicMaterial,
    LoopOnce,
    Mesh,
    MeshBasicMaterial,
    MeshLambertMaterial,
    MeshStandardMaterial,
    MeshPhongMaterial,
    PerspectiveCamera,
    Scene,
    Skeleton,
    SkeletonHelper,
    SkinnedMesh,
    SphereGeometry,
    SpotLight,
    SpotLightHelper,
    Uint16BufferAttribute,
    Vector3,
    Vector4,
    WebGLRenderer,
    Audio,
    AudioListener,
    AudioLoader,
    PositionalAudio,
    AudioAnalyser,
    AmbientLight,
    sRGBEncoding,
    Color,
    Vector2,
    Light,
    Camera,
    Renderer,
    DirectionalLightHelper,
    Material,
    NearestMipmapLinearFilter,
    MeshMatcapMaterial,
    TextureLoader,
    TorusGeometry,
    CubeTextureLoader
} from 'three';
import * as dat from 'dat.gui';
import LightControl from '../utils/lightControl';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import mp3 from '../assets/1.mp3';
import fbx from '../assets/33.glb?url';
import fbx1 from '../assets/1111.fbx?url';
import map from '../assets/map.png';
// import kk from '../assets/skidpan.png';
import kk from '../assets/22233.png';
// import fbx from '../assets/a.glb?url';
// import stl from '../assets/13.stl?url';
// import stl from '../assets/a.glb?url';
// import stl from '../assets/2.dae?url';
// import stl from '../assets/23.obj?url';
const clock = new Clock();
let mixer = null;
let clip = null;
let AnimationAction = null;
let skeleton: Skeleton | null = null;
// let n = 0;
const T = 50;
const step = 0.01;
let analyser: AudioAnalyser | null = null;
const scene0: Scene = new Scene();
let renderer0: Renderer | null = null;
let camera0: null | Camera = null;
const gui = new dat.GUI();
// 渲染函数
const Animation = () => {
    const ref = useRef<HTMLCanvasElement>(null);
    const [light0, setLight0] = useState(new SpotLight(0xffffff));
    const [random, setRandom] = useState(0);

    // 添加关键帧动画对象
    const addScene = useCallback((scene: Scene) => {
        const geo = new SphereGeometry(20, 10, 10);
        const matrial = new MeshBasicMaterial({
            color: 0xff0000
        });
        const mesh = new Mesh(geo, matrial);
        mesh.position.set(0, 0, 0);
        const group = new Group();
        mesh.name = 'Box';
        group.add(mesh);
        // 设置三个关键帧动画
        const times = [0, 10]; //关键帧时间数组，离散的时间点序列
        const values = [0, 0, 0, 50, 0, 0]; //与时间点对应的值组成的数组
        // 创建位置关键帧对象：0时刻对应位置0, 0, 0   10时刻对应位置150, 0, 0
        const posTrack = new KeyframeTrack('Box.position', times, values);
        // 创建颜色关键帧对象：10时刻对应颜色1, 0, 0   20时刻对应颜色0, 0, 1
        const colorKF = new KeyframeTrack(
            'Box.material.color',
            [10, 20],
            [1, 0, 0, 0, 0, 1]
        );
        // 创建名为Sphere对象的关键帧数据  从0~20时间段，尺寸scale缩放3倍
        const scaleTrack = new KeyframeTrack(
            'Sphere.scale',
            [0, 20],
            [1, 1, 1, 3, 3, 3]
        );

        // duration决定了默认的播放时间，一般取所有帧动画的最大时间
        // duration偏小，帧动画数据无法播放完，偏大，播放完帧动画会继续空播放
        const duration = 20;
        // 多个帧动画作为元素创建一个剪辑clip对象，命名"default"，持续时间20
        clip = new AnimationClip('default', duration, [
            posTrack,
            colorKF,
            scaleTrack
        ]);
        mixer = new AnimationMixer(group);
        // 剪辑clip作为参数，通过混合器clipAction方法返回一个操作对象AnimationAction
        AnimationAction = mixer.clipAction(clip);
        //通过操作Action设置播放方式
        AnimationAction.timeScale = 20; //默认1，可以调节播放速度
        // AnimationAction.loop = THREE.LoopOnce; //不循环播放
        AnimationAction.loop = LoopOnce;
        AnimationAction.clampWhenFinished = true;
        // AnimationAction.play(); //开始播放

        scene.add(group);
    }, []);
    // 添加骨骼动画
    const addScene1 = useCallback((scene: Scene) => {
        const geometry = new CylinderGeometry(5, 10, 120, 50, 300);
        geometry.translate(0, 60, 0);
        const position = geometry.getAttribute('position');
        console.log(position);

        const skinIndices = [];
        const skinWeights = [];
        for (let i = 0; i < position.count; i++) {
            const vertex = new Vector3().fromBufferAttribute(position, i);
            if (vertex.y <= 60) {
                // 设置每个顶点蒙皮索引属性  受根关节Bone1影响
                skinIndices.push(0, 0, 0, 0);
                // 设置每个顶点蒙皮权重属性
                // 影响该顶点关节Bone1对应权重是1-vertex.y/60
                skinWeights.push(1 - vertex.y / 60, 0, 0, 0);
            } else if (60 < vertex.y && vertex.y <= 60 + 40) {
                // Vector4(1, 0, 0, 0)表示对应顶点受关节Bone2影响
                skinIndices.push(1, 0, 0, 0);
                // 影响该顶点关节Bone2对应权重是1-(vertex.y-60)/40
                skinWeights.push(1 - (vertex.y - 60) / 40, 0, 0, 0);
            } else if (60 + 40 < vertex.y && vertex.y <= 60 + 40 + 20) {
                // Vector4(2, 0, 0, 0)表示对应顶点受关节Bone3影响
                skinIndices.push(2, 0, 0, 0);
                // 影响该顶点关节Bone3对应权重是1-(vertex.y-100)/20
                skinWeights.push(1 - (vertex.y - 100) / 20, 0, 0, 0);
            }
        }
        geometry.setAttribute(
            'skinIndex',
            new Uint16BufferAttribute(skinIndices, 4)
        );
        geometry.setAttribute(
            'skinWeight',
            new Float32BufferAttribute(skinWeights, 4)
        );

        const material = new MeshBasicMaterial({});
        const skinnedMesh = new SkinnedMesh(geometry, material);
        skinnedMesh.position.set(50, 120, 50);
        skinnedMesh.rotateX(Math.PI);
        scene.add(skinnedMesh);

        /**
         * 骨骼系统
         */
        //
        const Bone1 = new Bone(); //关节1，用来作为根关节
        const Bone2 = new Bone(); //关节2
        const Bone3 = new Bone(); //关节3
        // 设置关节父子关系   多个骨头关节构成一个树结构
        Bone1.add(Bone2);
        Bone2.add(Bone3);
        // 设置关节之间的相对位置
        //根关节Bone1默认位置是(0,0,0)
        Bone2.position.y = 60; //Bone2相对父对象Bone1位置
        Bone3.position.y = 40; //Bone3相对父对象Bone2位置

        // 所有Bone对象插入到Skeleton中，全部设置为.bones属性的元素
        skeleton = new Skeleton([Bone1, Bone2, Bone3]); //创建骨骼系统
        // console.log(skeleton.bones);
        // 返回所有关节的世界坐标
        // skeleton.bones.forEach(elem => {
        //   console.log(elem.getWorldPosition(new THREE.Vector3()));
        // });
        //骨骼关联网格模型
        skinnedMesh.add(Bone1); //根骨头关节添加到网格模型
        skinnedMesh.bind(skeleton); //网格模型绑定到骨骼系统
        console.log(skinnedMesh);
        /**
         * 骨骼辅助显示
         */
        const skeletonHelper = new SkeletonHelper(skinnedMesh);
        scene.add(skeletonHelper);
        skeleton.bones[1].rotation.x = 0.5;
        skeleton.bones[2].rotation.x = 0.5;

        // 转动关节带动骨骼网格模型出现弯曲效果  好像腿弯曲一样
    }, []);
    const addScene2 = useCallback((scene: Scene) => {
        const geo = new BoxGeometry(50, 50, 50);
        const box1 = new BoxGeometry(100, 5, 100);
        const box2 = new BoxGeometry(5, 200, 5);

        geo.morphAttributes.position = [
            new BufferAttribute(box1.getAttribute('position').array, 3),
            new BufferAttribute(box2.getAttribute('position').array, 3)
        ];
        const material = new MeshPhongMaterial({
            color: 0x0000ff
        });
        const mesh = new Mesh(geo, material);
        // (mesh.morphTargetInfluences as number[])[0] = 0.5;
        // (mesh.morphTargetInfluences as number[])[1] = 1;
        scene.add(mesh);
        const Track1 = new KeyframeTrack(
            '.morphTargetInfluences[0]',
            [0, 10, 20],
            [0, 1, 0]
        );
        const Track2 = new KeyframeTrack(
            '.morphTargetInfluences[1]',
            [20, 30, 40],
            [0, 1, 0]
        );
        const clip = new AnimationClip('default', 40, [Track1, Track2]);
        mixer = new AnimationMixer(mesh); //创建混合器
        const AnimationAction = mixer.clipAction(clip); //返回动画操作对象
        AnimationAction.timeScale = 5; //默认1，可以调节播放速度
        AnimationAction.play(); //开始播放
    }, []);

    const addScene3 = useCallback((scene: Scene, camera: PerspectiveCamera) => {
        const audioMesh = new Mesh(
            new BoxGeometry(20, 20, 20),
            new MeshPhongMaterial({
                color: 0xffffff
                // emissive: 0xff0000
            })
        );
        audioMesh.name = 'song';
        audioMesh.position.set(20, 20, 20);
        scene.add(audioMesh);

        const listener = new AudioListener();
        camera.add(listener); // 收音对象
        const PosAduio = new PositionalAudio(listener); // 物化音乐, 音乐编码设置到收音机上
        audioMesh.add(PosAduio);

        const audioLoader = new AudioLoader();
        audioLoader.load(mp3, (audioBuffer) => {
            // navigator.mediaDevices.getUserMedia({ audio: true });
            PosAduio.setBuffer(audioBuffer);
            PosAduio.setLoop(true);
            PosAduio.setVolume(0.7);
            PosAduio.setRefDistance(300);
            analyser = new AudioAnalyser(PosAduio);
            document.addEventListener('mousedown', () => {
                if (PosAduio.isPlaying) return;
                PosAduio.play();
            });
        });
    }, []);

    const addScene4 = useCallback((scene: Scene, camera: PerspectiveCamera) => {
        const meshGroup = new Group();
        meshGroup.name = 'song';
        const N = 128; //控制音频分析器返回频率数据数量
        for (let i = 0; i < N / 2; i++) {
            const box = new BoxGeometry(10, 100, 10); //创建一个立方体几何对象
            const material = new MeshPhongMaterial({
                color: 0x0000ff
            }); //材质对象
            const mesh = new Mesh(box, material); //网格模型对象
            // 长方体间隔20，整体居中
            mesh.position.set(20 * i - (N / 2) * 10, 0, 0);
            meshGroup.add(mesh);
        }

        scene.add(meshGroup);

        const audioListener = new AudioListener();

        camera.add(audioListener);

        const posAudio = new Audio(audioListener);
        // meshGroup.add(posAudio);
        const loader = new AudioLoader();
        analyser = new AudioAnalyser(posAudio);
        loader.load(mp3, (buffer) => {
            posAudio.setBuffer(buffer);
            posAudio.setVolume(0.8);
            document.addEventListener('mousedown', () => {
                if (posAudio.isPlaying) return;
                posAudio.play();
            });
            // posAudio.setRefDistance(200);
        });
    }, []);

    const addScene5 = useCallback((scene: Scene, camera: PerspectiveCamera) => {
        const loader = new GLTFLoader();
        // const loader = new FBXLoader();
        // loader.setPath('/src/assets/');
        loader.load(fbx, (group) => {
            //     group.traverse((obj) => {
            //         if (obj.material) {
            //             console.log(obj.material);

            // obj.material.emissive = new Color(1, 1, 1);
            // obj.material.emissiveIntensity = 1;
            // obj.material.emissiveMap = obj.material.map;
            // }
            // item.castShadow = true;
            // item.receiveShadow = true;
            // });
            // group.scale.set(0.1, 0.1, 0.1);
            // geo.scale.set(20, 20, 20);
            // console.log(geo.scene);
            // geo.rotateX(-Math.PI / 2);
            // geo.rotateY(-Math.PI / 2);
            // geo.scale(20, 20, 20);
            // const mesh = new Mesh(
            //     geo,
            //     new MeshPhongMaterial({
            //         color: '#ccc'
            //         // wireframe: true
            //     })
            // );
            // scene.add(group);
            group.scene.children.forEach((obj: Mesh) => {
                if (!obj.material) return;
                obj.material.emissive = obj.material.color;
                obj.material.emissiveIntensity = 1;
                obj.material.emissiveMap = obj.material.map;
                obj.material.roughnessMap = null;
            });
            // group.rotateX(Math.PI / 2);
            group.scene.scale.set(100, 100, 100);
            // console.log(group.scene, 123);
            // scene.add(group);
            scene.add(group.scene);
        });
    }, []);

    const addScene6 = useCallback((scene: Scene, camera: PerspectiveCamera) => {
        // const loader = new GLTFLoader();
        const loader = new FBXLoader();
        // loader.setPath('/src/assets/');
        loader.load(fbx1, (group) => {
            console.log(group.children[0], 1);
            //     group.traverse((obj) => {
            //         if (obj.material) {
            //             console.log(obj.material);

            // obj.material.emissive = new Color(1, 1, 1);
            // obj.material.emissiveIntensity = 1;
            // obj.material.emissiveMap = obj.material.map;
            // }
            // item.castShadow = true;
            // item.receiveShadow = true;
            // });
            // group.scale.set(0.1, 0.1, 0.1);
            // geo.scale.set(20, 20, 20);
            // console.log(geo.scene);
            // geo.rotateX(-Math.PI / 2);
            // geo.rotateY(-Math.PI / 2);
            // geo.scale(20, 20, 20);
            // const mesh = new Mesh(
            //     geo,
            //     new MeshPhongMaterial({
            //         color: '#ccc'
            //         // wireframe: true
            //     })
            // );
            // scene.add(group);
            group.position.set(30, 0, 0);
            (group.children as Mesh[]).forEach((obj) => {
                const material = obj.material as MeshLambertMaterial;
                if (!material) return;
                // material.normalScale = new Vector2(1, 1);
                material.emissive = material.color;
                // material.emissiveIntensity = 1;
                material.emissiveMap = material.map;
                material.flatShading = true;
                material.map.minFilter = NearestMipmapLinearFilter;
                gui.add(obj.material, 'wireframe').name('显示线框');
                gui.addColor(obj.material, 'color');
                gui.add(
                    group.rotation,
                    'y',
                    -Math.PI / 2,
                    Math.PI / 2,
                    Math.PI / 90
                );
            });
            // group.rotateX(Math.PI / 2);
            // group.scale.set(100, 100, 100);
            // console.log(group.scene, 123);
            // scene.add(group);
            scene.add(group);
        });

        // const cube = new CubeTextureLoader().load([kk, kk, kk, kk, kk, kk]);
        // console.log(cube, 111);

        const texture = new TextureLoader().load(kk);
        // const mesh = new Mesh(
        //     new TorusGeometry(5, 2, 8, 8),
        //     new MeshMatcapMaterial({
        //         matcap: texture
        //     })
        // );
        const mesh = new Mesh(
            new BoxGeometry(30, 30, 30),
            new MeshStandardMaterial({
                // envMap: cube,
                map: texture,
                metalness: 0.7,
                roughness: 0.2
            })
        );
        mesh.position.y = 50;
        gui.add(mesh.rotation, 'z', 0, Math.PI * 2, Math.PI / 90).name('aaa');
        scene.add(mesh);
    }, []);

    const animation = (
        renderer: WebGLRenderer,
        scene: Scene,
        camera: PerspectiveCamera
        // skeleton: Skeleton
    ) => {
        renderer.render(scene, camera);
        // mixer.update(clock.getDelta());
        if (analyser) {
            const frequency = analyser.getAverageFrequency();
            if (frequency) {
                // const mesh = scene.getObjectByName('song') as Mesh;
                // mesh.scale.y = (5 * frequency) / 256;
                // mesh.material.color.r = 1 - (3 * frequency) / 256;
                // mesh.material.color.g = 1 - (3 * frequency) / 256;
                // mesh.material.color.b = 1 - (3 * frequency) / 256;

                const arr = analyser.getFrequencyData();
                const ele = scene.getObjectByName('song') as Group;
                ele.children.forEach((elem, index) => {
                    elem.scale.y = arr[index] / 80;
                    elem.material.color.r = arr[index] / 200;
                });
            }
        }
        requestAnimationFrame(animation.bind(null, renderer, scene, camera));
        // renderer.render(scene, camera);
        // requestAnimationFrame(
        //     animation.bind(null, renderer, scene, camera, skeleton)
        // );
        // n += 1;
        // if (n < T) {
        //     // 改变骨关节角度
        //     skeleton.bones[0].rotation.x = skeleton.bones[0].rotation.x - step;
        //     skeleton.bones[1].rotation.x = skeleton.bones[1].rotation.x + step;
        //     skeleton.bones[2].rotation.x =
        //         skeleton.bones[2].rotation.x + 2 * step;
        // }
        // if (n < 2 * T && n > T) {
        //     skeleton.bones[0].rotation.x = skeleton.bones[0].rotation.x + step;
        //     skeleton.bones[1].rotation.x = skeleton.bones[1].rotation.x - step;
        //     skeleton.bones[2].rotation.x =
        //         skeleton.bones[2].rotation.x - 2 * step;
        // }
        // if (n === 2 * T) {
        //     n = 0;
        // }
    };

    const initRender = () => {
        const renderer = new WebGLRenderer({
            canvas: ref.current as HTMLCanvasElement
        });
        renderer0 = renderer;
        renderer.physicallyCorrectLights = true;
        renderer.shadowMap.enabled = true;
        renderer.outputEncoding = sRGBEncoding;
        renderer.setSize(window.innerWidth, window.innerHeight);
        const scene = scene0;
        scene.add(new AxesHelper(100));
        // addScene2(scene);
        const camera = new PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera0 = camera;
        camera.lookAt(0, 0, 0);
        camera.position.set(100, 100, 100);
        // const light = new SpotLight(0xffffff);
        const light = new DirectionalLight(0xffffff);
        light.intensity = 4;
        light.position.set(300, 0, 300);
        light.lookAt(100, -300, 120);
        light.angle = Math.PI / 20;
        gui.add(light.position, 'x', 0, 300, 3).name('光照x');
        const helper = new DirectionalLightHelper(light);
        scene.add(light);
        scene.add(helper);
        addScene5(scene, camera);
        addScene6(scene, camera);
        const control = new OrbitControls(
            camera,
            ref.current as HTMLCanvasElement
        );
        control.addEventListener('change', () => {
            // animation(renderer, scene, camera);
        });
        requestAnimationFrame(
            animation.bind(null, renderer, scene, camera, skeleton as Skeleton)
        );
    };
    useEffect(() => {
        initRender();
    }, []);
    return (
        <div>
            <canvas ref={ref}></canvas>
            {/* <LightControl
                light={light0 as unknown as Light}
                callback={(light) => {
                    setLight0(light);
                    setRandom(Math.random());
                    renderer0.render(scene0, camera0 as Camera);
                }}
            ></LightControl> */}
            {/* <input
                type="range"
                onChange={(e) => {
                    AnimationAction.time = Number((e.target.value / 100) * 30);
                    clip.duration = Number((e.target.value / 100) * 30);
                    AnimationAction.play();
                }}
            /> */}
        </div>
    );
};
export default Animation;
