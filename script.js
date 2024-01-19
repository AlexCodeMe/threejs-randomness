import * as THREE from 'three'

// import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

// const controls = new OrbitControls(camera, renderer.domElement)
// const loader = new GLTFLoader()

class CustomSinCurve extends THREE.Curve {
	constructor(scale) {
		super()
		this.scale = scale
	}
	getPoint( t ) {
		const tx = t * 3 - 1.5
		const ty = Math.sin( 2 * Math.PI * t )
		const tz = 0
		return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale )
	}
}

const scene = new THREE.Scene()
scene.background = new THREE.Color(Math.random(), Math.random(), Math.random())
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// cube of cubes!
const shapes = []
const gridSize = 12
const spacing = 3

const randColor = () => {
    return new THREE.Color(Math.random(), Math.random(), Math.random())
}
const randShape = () => {
    const rand = Math.random()
    if (rand < 0.15) {
        return new THREE.BoxGeometry(1, 1, 1)
    } else if (0.15 < rand < 0.3) {
        return new THREE.TorusGeometry(1, 0.25, 10, 20)
    } else if (0.3 < rand < .45) {
        return new THREE.TorusKnotGeometry(0.5, 0.25, 2, 8, .5, .5)
    } else if (0.45 < rand < .6) {
        const shape = new THREE.Shape()
        const x = -.25
        const y = -.5
        shape.moveTo(x + .25, y + .25)
        shape.bezierCurveTo(x + .25, y + .25, x + .2, y, x, y)
        shape.bezierCurveTo(x - .3, y, x - .3, y + .35, x - .3, y + .35)
        shape.bezierCurveTo(x - .3, y + .55, x - .15, y + .77, x + .25, y + .95)
        shape.bezierCurveTo(x + .6, y + .77, x + .8, y + .45, x + .8, y + .35)
        shape.bezierCurveTo(x + .8, y + .35, x + .8, y, x + .5, y)
        shape.bezierCurveTo(x + .35, y, x + .25, y + .25, x + .25, y + .25)
        const extrudeSettings = {
            steps: 2, 
            depth: .5,  
            bevelEnabled: false,  
            bevelThickness: 1,  
            bevelSize: 1,  
            bevelSegments: 2,
          }
        return new THREE.ExtrudeGeometry(shape, extrudeSettings)
    } else if (0.6 < rand < 0.75) {
        return new THREE.OctahedronGeometry(1)
    } else if (0.75 < rand < .9) {
       const path = new CustomSinCurve(.25)
       return new THREE.TubeGeometry(path, 20, 1, 8, false)
    } else {
        return new THREE.TetrahedronGeometry(1, 1);
    }
}

for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        const geometry = randShape()
        const material = new THREE.MeshBasicMaterial({ color: randColor() })
        const shape = new THREE.Mesh(geometry, material)
        shape.position.x = (i - (gridSize - 1) / 2) * spacing
        shape.position.y = (j - (gridSize - 1) / 2) * spacing

        shapes.push(shape) 
        scene.add(shape)
    }
}

camera.position.z = 5

const animate = () => {
    requestAnimationFrame(animate)
    shapes.forEach((cube) => {
        cube.rotation.x += 0.05
        cube.rotation.y += 0.05
    })

    // cube.rotation.x += 0.05
    // cube.rotation.y += 0.05
    renderer.render(scene, camera)
}
animate()