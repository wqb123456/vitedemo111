import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    AmbientLight,
    CameraHelper,
    LoadingManager,
    Mesh,
    MeshBasicMaterial,
    MeshLambertMaterial,
    OrthographicCamera,
    PerspectiveCamera,
    PointLight,
    RepeatWrapping,
    Scene,
    SphereGeometry,
    SpotLight,
    AxesHelper,
    sRGBEncoding,
    TextureLoader,
    WebGLRenderer,
    MeshPhongMaterial,
    MeshStandardMaterial,
    BufferGeometry,
    BufferAttribute,
    DoubleSide,
    PointsMaterial,
    Points,
    Line,
    LineBasicMaterial,
    BoxGeometry,
    LineDashedMaterial,
    LineLoop,
    LineSegments,
    Vector3,
    SkinnedMesh,
    PlaneGeometry,
    DirectionalLight,
    DirectionalLightHelper
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import img from '../assets/4.webp';
import './mooncake.scss';
function MoonCake() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const scene = useRef<Scene>(new Scene());
    const mesh = useRef<null | Array<Mesh>>(null);

    useEffect(() => {
        const loader = new TextureLoader(new LoadingManager());
        const marbleTexture = loader.load(img);
        marbleTexture.wrapS = marbleTexture.wrapT = RepeatWrapping;
        marbleTexture.repeat.set(1, 1);
        marbleTexture.anisotropy = 1;
        marbleTexture.encoding = sRGBEncoding;

        // const geo = new BufferGeometry();
        // const attr = new Float32Array([
        //     0,
        //     0,
        //     0, //顶点1坐标
        //     50,
        //     0,
        //     0, //顶点2坐标
        //     50,
        //     100,
        //     0,
        //     0,
        //     100,
        //     0 //顶点3坐标
        //     // 0,
        //     // 0,
        //     // 0, //顶点4坐标
        //     // 0,
        //     // 0,
        //     // 100, //顶点5坐标
        //     // 50,
        //     // 0,
        //     // 0 //顶点6坐标
        // ]);
        // geo.attributes.position = new BufferAttribute(attr, 3);

        // const colors = new Float32Array([
        //     1,
        //     0,
        //     0, //顶点1颜色
        //     0,
        //     1,
        //     0, //顶点2颜色
        //     0,
        //     0,
        //     1, //顶点3颜色

        //     1,
        //     1,
        //     0, //顶点4颜色
        //     0,
        //     1,
        //     1, //顶点5颜色
        //     1,
        //     0,
        //     1 //顶点6颜色
        // ]);
        // geo.attributes.color = new BufferAttribute(colors, 3);

        // const normals = new Float32Array([
        //     // 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0
        //     0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1
        // ]);
        // geo.attributes.normal = new BufferAttribute(normals, 3);

        // const indexList = new Uint16Array([0, 1, 2, 1, 2, 3]);

        // geo.index = new BufferAttribute(indexList, 1);

        const geo = new PlaneGeometry(100, 100);
        geo.setAttribute(
            'color',
            new BufferAttribute(
                new Float32Array([
                    1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1,
                    0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1,
                    0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0,
                    1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1,
                    1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1,
                    1, 0, 1, 0, 0, 1, 1, 1
                ]),
                3
            )
        );
        // geo.rotateX((Math.PI * 2) / 3);
        // geo.scale(1.5, 1.5, 1.5);
        // geo.translate(50, 0, 0);
        // geo.rotateY(Math.PI / 2);
        // geo.center();
        // geo.addGroup(0, 1, 2);

        const ball = new Mesh( // 点 线 面 渲染模式
            // new SphereGeometry(2, 50, 50),
            geo,
            // 点模型材质
            new MeshPhongMaterial({
                color: 0xff0000,
                // vertexColors: true,
                side: DoubleSide
                // size: 3,
                // transparent: true,
                // opacity: 0.1
                // vertexColors: true
            })
            // new MeshPhongMaterial({
            //     // transparent: true,
            //     // opacity: 0.6,
            //     color: 0x0000ff,
            //     specular: 0xff0000
            //     // emissive: 0xff0000
            // })
            // new MeshBasicMaterial({ map: marbleTexture })
        );
        // ball.scale.set(1.5, 1.5, 1.5);
        ball.geometry.computeBoundingSphere();
        ball.geometry.computeBoundingBox();
        // ball.geometry.translate(100, 100, 0);
        // ball.rotateX(Math.PI / 2);
        ball.castShadow = true;
        ball.rotateX(Math.PI);
        ball.scale.x = 2;
        // ball.translateOnAxis(new Vector3(100, 100, 0).normalize(), 50);
        const clone = ball.clone();
        ball.scale.x = 4;
        clone.translateY(100);
        clone.translateZ(100);
        // clone.translateOnAxis(new Vector3(100, 0, 0).normalize(), 300);
        // ball.receiveShadow = true;
        mesh.current = [ball, clone];
    }, []);

    const camera = useRef(
        new PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        // new OrthographicCamera()
    );
    const [renderer, setRenderer] = useState<WebGLRenderer | null>(null);
    const animation = () => {
        renderer?.render(scene.current, camera.current);
        // mesh.current?.rotateY(Math.PI / 180);
        // mesh.current?.translateOnAxis(new Vector3(1, 0, 0).normalize(), 3);
        requestAnimationFrame(animation);
    };

    // useEffect(() => {
    //     if (renderer && scene.current && camera.current) animation();
    // }, [renderer, scene.current, camera.current]);

    useEffect(() => {
        if (scene.current && mesh.current && canvasRef.current && renderer) {
            // mesh.current.map((item) => item.position.set(0, 0, 0));
            const spotLight = new DirectionalLight(0xffffff);
            // const spotLight = new AmbientLight(0xffffff);
            // spotLight.castShadow = true;
            spotLight.position.set(0, 100, 0);
            spotLight.target = mesh.current[1];
            // spotLight.lookAt(mesh.current[0].position);
            scene.current.add(spotLight);
            scene.current.add(...mesh.current);
            scene.current.add(camera.current);
            scene.current.add(new DirectionalLightHelper(spotLight));
            // scene.current.add(new AxesHelper(250));

            // const camera1 = new PerspectiveCamera( // 辅助相机
            //     45,
            //     window.innerWidth / window.innerHeight,
            //     10,
            //     100
            // );
            // camera1.position.set(0, 0, 20);
            // camera1.lookAt(0, 0, 0);
            // scene.current.add(new CameraHelper(camera1));

            requestAnimationFrame(animation);
            const controls = new OrbitControls(
                camera.current,
                canvasRef.current
            );
            controls.addEventListener('change', animation);
        }
    }, [renderer, scene.current, mesh.current, canvasRef.current]);

    useEffect(() => {
        if (canvasRef.current && !renderer) {
            camera.current.position.z = 500;
            camera.current.position.y = -450;
            const renderer = new WebGLRenderer({
                canvas: canvasRef.current
            });
            renderer.setSize(window.innerWidth, window.innerHeight);
            setRenderer(renderer);
        }
    }, [canvasRef.current, renderer]);

    return (
        <div className="container">
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}
export default MoonCake;
