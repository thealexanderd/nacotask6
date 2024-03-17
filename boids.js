let Scene = {
	w : 300, h : 300, swarm : [],
	neighbours( x ){
		let r = []
		for( let p of this.swarm ){
			if( dist( p.pos.x, p.pos.y, x.x, x.y ) <= 50 ){
				r.push( p )
			}
		}
		return r
	}
}

class Particle {
	constructor(){
		this.pos = createVector( random(0,Scene.w), random(0,Scene.h) )
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
	step(){
		let N = Scene.neighbours( this.pos ), 
			avg_sin = 0, avg_cos = 0,
			avg_p = createVector( 0, 0 ),
			avg_d = createVector( 0, 0 )
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
		let alignmentStrength = 4;
		avg_angle *= alignmentStrength;
		this.dir = p5.Vector.fromAngle( avg_angle )
		let cohesion = p5.Vector.sub( avg_p, this.pos )
		cohesion.div( 131 )
		this.dir.add( cohesion )
        avg_d.mult( 20 )
		this.dir.add( avg_d )
        this.dir.mult( 4 )
		this.pos.add( this.dir )
		this.wrap()
	}
}

function setup(){
	createCanvas( Scene.w, Scene.h )
	for( let _ of Array(15) ){
		Scene.swarm.push( new Particle() )
	}
}

function find_nearest(boid) {
	let N = Scene.neighbours( boid.pos )
	let min_dist = 51
	let nearest = null
	for( let n of N  ){
		let dist = p5.Vector.dist(boid.pos, n.pos)
		if (n != boid && dist < min_dist) {
			min_dist = dist
			nearest = n
		}
	}
	return min_dist
}

function calc_norm(vec) {
  let sum = 0;
  sum += vec.x * vec.x + vec.y * vec.y
  return Math.sqrt(sum)
}

let steps = 0
let steps_boids = []
let flag = true
let measures = []
let distances = []
function draw(){
    if ( steps < 300 ) {
      let current = []
	  let min_distances = []
	background( 220 )
	for( let p of Scene.swarm ){
		p.step()
		p.draw()
        current.push(p.dir)
		min_distances.push(find_nearest(p))
	}
	distances.push(min_distances)
	// console.log(min_distances)
      // console.log(current[2].div(calc_norm(current[2])))
      vector_sum = current[0].div(calc_norm(current[0]))
    for(let i = 1; i < current.length; i++) {
      vector_sum.add(current[i].div(calc_norm(current[i])))
    }
      // console.log(calc_norm(vector_sum))
      
      measure = 1/200 * calc_norm(vector_sum)
      console.log(measure)
	//   measures.push(measure)
	// console.log(distances)
    steps++
    } else {
	  if (flag) {
		flag = false
		// console.log("here")
		// console.log(measures)
	  }
	}



}


