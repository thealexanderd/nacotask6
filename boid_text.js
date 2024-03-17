const p = require('node-p5');
const vec = require('vectors')
const fs = require('fs')


function sketch(p5) {
    main(p5);
    process.exit(0);
}

let p5Instance = p.createSketch(sketch);

function dist(x1, y1, x2, y2) {
    diff = Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2)
    return Math.sqrt(diff)
}

cohesion_value = 200
separation_value = 4
alignment_value = 2

if(process.argv.length == 5) {
    cohesion_value = parseInt(process.argv[2])
    separation_value = parseInt(process.argv[3])
    alignment_value = parseInt(process.argv[4])
}


let Scene = {
	w : 600, h : 600, swarm : [],
	neighbours( x, p5 ){
		let r = []
		for( let p of this.swarm ){
			if( dist( p.pos.x, p.pos.y, x.x, x.y ) <= 100 ){
				r.push( p )
			}
		}
		return r
	}
}

class Particle {
	constructor(p5){
		this.pos = p5.createVector( Math.random(0,Scene.w), Math.random(0,Scene.h) )
		this.dir = p5.Vector.random2D()
	}
	wrap(){
		if( this.pos.x < 0 ) this.pos.x += Scene.w
		if( this.pos.y < 0 ) this.pos.y += Scene.h
		if( this.pos.x > Scene.w ) this.pos.x -= Scene.w
		if( this.pos.y > Scene.h ) this.pos.y -= Scene.h

	}
	draw(){
		fill( 0 )
		ellipse( this.pos.x, this.pos.y, 5, 5 )
	}
	step(p5){
        
		let N = Scene.neighbours( this.pos, p5 ), 
			avg_sin = 0, avg_cos = 0,
			avg_p = p5.createVector( 0, 0 ),
			avg_d = p5.createVector( 0, 0 )
        if(N.length > 1) {
		for( let n of N  ){
			avg_p.add( n.pos )
			if( n != this ){
				let away = p5.Vector.sub( this.pos, n.pos )
				away.div( away.magSq() ) 
				avg_d.add( away )
			}
			avg_sin += Math.sin( n.dir.heading() ) / N.length
			avg_cos += Math.cos( n.dir.heading() ) / N.length
		}
        
		avg_p.div( N.length ); avg_d.div( N.length )
		let avg_angle = Math.atan2( avg_cos, avg_sin )
		avg_angle += Math.random()*0.5 - 0.25
        avg_angle *= alignment_value;
		this.dir = p5.Vector.fromAngle( avg_angle )
		let cohesion = p5.Vector.sub( avg_p, this.pos )
		cohesion.div( cohesion_value )
		this.dir.add( cohesion )
        avg_d.mult( separation_value)
		this.dir.add( avg_d )
        this.dir.mult( 4 )
		this.pos.add( this.dir )
		this.wrap()
    }
	}
}

function setup(){
	for( let _ of Array(200) ){
		Scene.swarm.push( new Particle() )
	}
}

function find_nearest(boid, p5) {
	let N = Scene.neighbours( boid.pos )
	let min_dist = 101
	let nearest = null
	for( let n of N  ){
		let distance = dist(boid.pos.x, boid.pos.y, n.pos.x, n.pos.y)
		if (n != boid && distance < min_dist) {
			min_dist = distance
			nearest = n
		}
	}
	return min_dist
}

function calc_norm(vec, p5) {
  let sum = 0;
  sum += vec.x * vec.x + vec.y * vec.y
  return Math.sqrt(sum)
}

let steps = 300
let steps_boids = []
let flag = true
let measures = []
let distances = []
let Nb = 200

function main(p5) {
    for( let _ of Array(Nb) ){
		Scene.swarm.push( new Particle(p5) )
	}
    let current = []

    for(var st = 0; st < steps; st++) {
        current = []
	    let min_distances = []
        for( let p of Scene.swarm ){
            p.step(p5)
            // p.draw()
            current.push(p.dir)
            min_distances.push(find_nearest(p, p5))
        }
        let avg_distance = 0
        for(let i = 0; i < min_distances.length; i++) {
            avg_distance += min_distances[i]
        }
        avg_distance /= min_distances.length
        distances.push(avg_distance)
    } 

    if(current[0].mag() > 0) {
        vector_sum = current[0].div(current[0].mag())
    } else {
        vector_sum = current[0]
    }
        for(let i = 1; i < current.length; i++) {
            if(current[i].mag() > 0) {
                vector_sum.add(current[i].div(current[i].mag()))
            } else {
                vector_sum.add(current[i])
            }
        }
        measure = 1/Nb* vector_sum.mag()
    console.log(measure)
    avg_distance = 0
    for(let i = 0; i < distances.length; i++) {
        avg_distance += distances[i]
    }
    avg_distance /= distances.length
    console.log(avg_distance)
    // console.log(measures)
    // console.log(measures[steps-1])
    // fs.writeFileSync("./results_first_part.txt", JSON.stringify(measures), function(err) {
    //     console.log(err)
    // })
    // fs.writeFileSync("./results_first_part_nearest_distance.txt", JSON.stringify(distances), function(err) {
    //     console.log(err)
    // })
    // fs.writeFileSync("./results_good_params.txt", JSON.stringify(measures), function(err) {
    //     console.log(err)
    // })
    // fs.writeFileSync("./results_good_params_neighbor_distance_txt", JSON.stringify(distances), function(err) {
    //     console.log(err)
    // })
    // conso
    
    // console.log(distances)
    return
}

// main()