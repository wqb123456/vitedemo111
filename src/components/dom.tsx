import { useEffect, useRef } from 'react';
import React from 'react';
import {
    AmbientLight,
    ArcCurve,
    AxesHelper,
    BoxGeometry,
    BufferAttribute,
    BufferGeometry,
    CanvasTexture,
    CatmullRomCurve3,
    CubicBezierCurve3,
    CurvePath,
    DataTexture,
    DirectionalLight,
    DoubleSide,
    ExtrudeGeometry,
    Float32BufferAttribute,
    Group,
    ImageLoader,
    LatheGeometry,
    Line,
    LineBasicMaterial,
    LineCurve,
    LineCurve3,
    LoadingManager,
    Mesh,
    MeshBasicMaterial,
    MeshLambertMaterial,
    MeshPhongMaterial,
    PerspectiveCamera,
    PlaneGeometry,
    PointLight,
    Points,
    PointsMaterial,
    QuadraticBezierCurve3,
    RepeatWrapping,
    RGBAFormat,
    RGBFormat,
    Scene,
    Shape,
    ShapeGeometry,
    SphereGeometry,
    SplineCurve,
    SpotLight,
    SpotLightHelper,
    Sprite,
    SpriteMaterial,
    TextureLoader,
    TubeGeometry,
    Vector2,
    Vector3,
    WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import img from '../assets/rain.png';
import img0 from '../assets/1.jpg';

let _renderer = null;
let _camera: PerspectiveCamera = null;
const demo = () => {
    const canvasRef = useRef(null);
    window.onresize = () => {
        _renderer.setSize(window.innerWidth, window.innerHeight);
        _camera.aspect = window.innerWidth / window.innerHeight;
        _camera.updateProjectionMatrix();
    };
    const animation = (
        renderer: WebGLRenderer,
        scene: Scene,
        camera: PerspectiveCamera
    ) => {
        if (scene?.getObjectByName('songqiang')) {
            const group = scene.getObjectByName('songqiang');
            group?.children.forEach((item) => {
                item.position.y =
                    item?.position.y <= 0 ? 200 : item?.position.y - 1;
                item.position.x =
                    item.position.x < -100 || item.position.x > 100
                        ? Math.random() * 200 - 100
                        : item.position.x - Math.random() * 2 + 1;
            });
        }
        requestAnimationFrame(animation.bind(null, renderer, scene, camera));
        renderer.render(scene, camera);
    };
    useEffect(() => {
        if (!canvasRef.current) return;
        const camera = new PerspectiveCamera(
            75,
            window.innerWidth / innerHeight,
            0.1,
            1000
        );
        _camera = camera;
        camera.position.z = 100;
        const renderer = new WebGLRenderer({
            canvas: canvasRef.current
        });
        _renderer = renderer;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        const scene = new Scene();

        const spotLight = new AmbientLight(0xffffff);
        spotLight.position.set(50, 200, 0);
        spotLight.lookAt(0, 0, 0);
        // spotLight.intensity = 5;
        // spotLight.castShadow = true;
        // spotLight.angle = (Math.PI * 2) / 3;
        // spotLight.shadow.camera.near = 1;
        // spotLight.shadow.camera.far = 300;
        // spotLight.shadow.camera.left = -50;
        // spotLight.shadow.camera.right = 50;
        // spotLight.shadow.camera.fov = 20;
        scene.add(spotLight);
        scene.add(new AxesHelper(100));
        // scene.add(new SpotLightHelper(spotLight
        const mesh = new Mesh(
            new SphereGeometry(20, 100, 100),
            new MeshLambertMaterial({
                // color: '#111'
                map: new TextureLoader().load(img0)
            })
        );
        mesh.position.set(0, 20, 0);
        mesh.castShadow = true;
        scene.add(mesh);
        const canvas0 = document.createElement('canvas');
        canvas0.width = 1000;
        canvas0.height = 750;
        const texture = new CanvasTexture(canvas0);
        // const img0 = new Image(1000, 750);
        // img0.onload = () => {
        //     const style = canvas0
        //         .getContext('2d')
        //         ?.createPattern(img0, 'repeat-x');
        //     canvas0.getContext('2d').fillStyle = style;
        //     canvas0.getContext('2d')?.fillRect(0, 0, 1000, 750);
        //     canvas0.getContext('2d').fillStyle = '#ff0000';
        //     canvas0.getContext('2d').font = 'bold 24px 宋体';
        //     canvas0
        //         .getContext('2d')
        //         ?.fillText('副业超天才大王 ----  李超大大大帅哥', 20, 50);
        //     texture.needsUpdate = true;
        // };
        // img0.src = img;
        // const geo = new BoxGeometry(10, 10, 10);
        // const matrial = new MeshPhongMaterial({
        // map: texture
        // emissive: '#eeeeee'
        //     color: 0x00ff00,
        //     specular: 0x00ff00,
        //     shininess: 30
        // });
        // const mesh00 = new Mesh(geo, matrial);
        // mesh00.rotateX(-Math.PI / 2);
        // scene.add(mesh00);
        // new TextureLoader().load(img, (texture) => {
        //     const geo = new PlaneGeometry(400, 300, 4, 4);
        // geo.setAttribute(
        //     'uv',
        //     new BufferAttribute(
        //         new Uint16Array([0, 1, 1, 1, 1, 0, 0, 0]),
        //         2
        //     )
        // ); // 这里uv对应geometry的positon uv -> position实现了长宽归一化
        // texture.center.set(0.5, 0.5);
        // texture.rotation = Math.PI / 2;
        //     texture.wrapS = RepeatWrapping;
        //     texture.wrapT = RepeatWrapping;
        //     texture.repeat.set(4, 6);
        //     texture.offset.set(0.8, 0.3);
        //     const mesh1 = new Mesh(
        //         geo,
        //         new MeshBasicMaterial({
        //             // color: '#fff',
        //             map: texture,
        //             // emissive: '#fff',
        //             side: DoubleSide
        //             // wireframe: true
        //         })
        //     );
        //     mesh1.receiveShadow = true;
        //     mesh1.rotateX(-Math.PI / 2);
        //     // mesh1.rotateY(Math.PI / 2);
        //     mesh1.position.set(0, -100, 0);
        //     mesh1.name = 'mesh1';

        //     scene.add(mesh1);

        //     const group = new Group();
        //     const clone = mesh.clone();
        //     clone.position.x = 50;
        //     clone.castShadow = true;
        //     group.add(mesh, clone);
        // });

        // scene.add(group);

        // const curve = new ArcCurve(0, 0, 40, 0, Math.PI * 2, false);
        // const points = curve.getPoints(50);
        // const geometry = new BufferGeometry();
        // const N = 50;
        // const position = [];
        // for (let i = 0; i < N; i++) {
        //     const x = (Math.PI * 2 * i) / N;
        //     position.push(Math.sin(x) * 40, Math.cos(x) * 40, 0);
        // }
        // geometry.setAttribute(
        //     'position',
        //     new Float32BufferAttribute(position, 3)
        // );
        // geometry.setFromPoints(points);
        // scene.add(
        //     new Line(
        //         geometry,
        //         new LineBasicMaterial({
        //             color: 0xff0000
        //         })
        //     )
        // );

        // const geometry = new BufferGeometry();
        // const p1 = new Vector3(50, 0, 0);
        // const p2 = new Vector3(0, 70, 30);
        // const line = new LineCurve3(p1, p2);
        // geometry.setFromPoints(line.getPoints());
        // scene.add(
        //     new Line(
        //         geometry,
        //         new LineBasicMaterial({
        //             color: 0xf0f0f0
        //         })
        //     )
        // );

        // const curve = new CubicBezierCurve3(
        //     new Vector3(-50, 20, 90),
        //     new Vector3(-10, 40, 40),
        //     new Vector3(0, 0, 0),
        //     new Vector3(60, -60, 30)
        // );
        // const geometry = new BufferGeometry();
        // geometry.setFromPoints(curve.getPoints(100));
        // scene.add(
        //     new Line(
        //         geometry,
        //         new LineBasicMaterial({
        //             color: 0x00ff00
        //         })
        //     )
        // );
        // const line1 = new LineCurve3(
        //     new Vector3(30, 100, 0),
        //     new Vector3(30, 0, 0)
        // );
        // 3;
        // const cur = new ArcCurve(0, 0, 30, 0, Math.PI, true);
        // const points = cur.getPoints();
        // const pointss = points.map((item) => new Vector3(...item, 0));
        // const line2 = new LineCurve3(
        //     new Vector3(-30, 100, 0),
        //     new Vector3(-30, 0, 0)
        // );
        // const cur1 = new CatmullRomCurve3(pointss);
        // const lines = new CurvePath<Vector3>();
        // lines.curves.push(line1, cur1, line2);
        // const geo = new BufferGeometry();
        // geo.setFromPoints(lines.getPoints(200));
        // const path = new CatmullRomCurve3([
        //     new Vector3(-10, -50, -50),
        //     new Vector3(10, 0, 0),
        //     new Vector3(8, 50, 50),
        //     new Vector3(-5, 0, 100)
        // ]);
        // scene.add(
        //     new Mesh(
        //         new TubeGeometry(lines, 100, 4, 100),
        //         new MeshLambertMaterial({
        //             color: 0xff0000
        //         })
        //     )
        // );
        // const geo = new LatheGeometry([
        //     new Vector2(10, 100),
        //     new Vector2(40, 50),
        //     new Vector2(10, 0)
        // ]);
        // const mesh0 = new Mesh(
        //     geo,
        //     new MeshPhongMaterial({
        //         color: 0xf0f0f,
        //         side: DoubleSide
        //         // wireframe: true
        //     })
        // );
        // mesh0.position.set(20, 0, 0);
        // scene.add(mesh0);
        // const shape = new Shape();
        // const points = [
        //     new Vector2(10, 100),
        //     new Vector2(60, 50),
        //     new Vector2(10, 0)
        // ];
        // shape.splineThru(points);
        // const mesh0 = new Mesh(
        //     new LatheGeometry(shape.getPoints(100), 100),
        //     new MeshPhongMaterial({
        //         color: 0xf0f0f,
        //         side: DoubleSide
        //         // wireframe: true
        //     })
        // );

        // const _points = [
        //     new Vector2(-50, -50),
        //     new Vector2(-60, 0),
        //     new Vector2(0, 50),
        //     new Vector2(10, 70),
        //     new Vector2(60, 0),
        //     new Vector2(50, -50)
        //     // new Vector2(-50, -50)
        // ];
        // const mesh0 = new Mesh(
        //     new ShapeGeometry(new Shape(_points), 6),
        //     new MeshPhongMaterial({
        //         color: 0xf0f0f0,
        //         side: DoubleSide,
        //         wireframe: true
        //     })
        // );

        // const shape = new Shape();
        // shape.absarc(0, 0, 20, 0, Math.PI, false);
        // shape.lineTo(-20, -50);
        // shape.absarc(0, -50, 20, Math.PI, Math.PI * 2, false);
        // shape.lineTo(20, 0);
        // const mesh0 = new Mesh(
        //     new LatheGeometry(shape.getPoints(4), 10),
        //     new MeshLambertMaterial({
        //         color: 0x000000,
        //         side: DoubleSide
        //         // wireframe: true
        //     })
        // );
        const texture2 = new TextureLoader().load(img);
        const group = new Group();
        for (let i = 0; i < 400; i++) {
            const sprite = new Sprite(
                new SpriteMaterial({
                    map: texture2
                })
            );
            sprite.position.set(
                Math.random() * 200 - 100,
                Math.random() * 200 + 10,
                Math.random() * 100
            );
            group.add(sprite);
        }
        group.name = 'songqiang';
        scene.add(group);

        // 自定义贴图像素
        // const geo = new PlaneGeometry(128, 128);
        // const width = 32;
        // const height = 32;
        // const size = width * height;

        // const data = new Uint8Array(size * 4);
        // for (let i = 0; i < size * 4; i += 4) {
        //     data[i] = Math.random() * 255;
        //     data[i + 1] = Math.random() * 255;
        //     data[i + 2] = Math.random() * 255;
        //     data[i + 3] = 0.2 * 255;
        // }

        // const texture3 = new DataTexture(data, width, height, RGBAFormat);
        // texture3.needsUpdate = true;
        // const material = new MeshPhongMaterial({
        //     map: texture3,
        //     transparent: true
        //     // color: 0xffffff
        // });
        // const info = new Mesh(geo, material);
        // info.rotateX(-Math.PI / 2);
        // scene.add(info);

        // 精灵贴图
        const geo = new PlaneGeometry(128, 128);
        const texture4 = new TextureLoader().load(img);
        texture4.wrapS = RepeatWrapping;
        texture4.wrapT = RepeatWrapping;
        texture4.repeat.set(10, 10);
        const mesh11 = new Mesh(
            geo,
            new MeshBasicMaterial({
                map: texture4
            })
        );
        mesh11.rotateX(-Math.PI / 2);
        scene.add(mesh11);

        const shape = new Shape();
        shape.absarc(0, 0, 4, 0, Math.PI * 2, false);
        const mesh0 = new Mesh(
            new ExtrudeGeometry(shape, {
                // depth: 100,
                extrudePath: new CatmullRomCurve3([
                    new Vector3(0, 10, 0),
                    new Vector3(10, 20, 0),
                    new Vector3(130, 240, 0),
                    new Vector3(350, 370, 0)
                ]),
                steps: 50,
                bevelEnabled: false
            }),
            new MeshLambertMaterial({
                color: 0xff0000,
                side: DoubleSide
                // wireframe: true
            })
        );
        mesh0.position.set(20, 0, 0);
        // scene.add(mesh0);

        const controls = new OrbitControls(camera, canvasRef.current);
        controls.addEventListener('change', () => {
            renderer.render(scene, camera);
        });
        requestAnimationFrame(animation.bind(null, renderer, scene, camera));
    }, [canvasRef.current]);
    return (
        <div>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};
export default demo;
