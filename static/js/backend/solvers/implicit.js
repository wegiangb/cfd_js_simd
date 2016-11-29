import numeric from "numeric"

export const implicit = {
	_1D: (array, scheme, params, BC) => {
		const { nt, dt, dx, c, sigma } = params
		const y_0 = [...array]

		const generateMatrix = (N, sigma) => {

			let A_0 = numeric.diag(numpy.ones(N-2).map( e => e*(2+1/sigma)))	
			A_0 = numeric.diag(numpy.ones(N-2).map( e => e*(1+1/sigma)))	
			A_0 = numeric.diag(numpy.ones(N-2).map( e => e*(scheme(sigma).d)))	
			let A = [...A_0]

			A_0.map( 
				(e, r) => e.map(
					(e, c) => {
						if(r === 0 && c === 0)
							A[r][r+1] = scheme(sigma).ud
						else if(r === A.length - 1 && c === A.length - 1)
							A[r][r-1] = scheme(sigma).ld
						else if(r === c && (r !== 0 && r !== A.length - 1)){
							A[r][r-1] = scheme(sigma).ld
							A[r][r+1] = scheme(sigma).ud
						}
					}
				)
			)
			console.log(A, scheme)
			return A
		}

		const generateRHS = (y, sigma) => {
			let RHS = y.map( (e, i) => e * 1/sigma )
			RHS.splice(RHS.length-1, 1)
			RHS.splice(0, 1)

			RHS[0] += y[0]
			RHS[RHS.length - 1] += y[y.length - 1]

			return RHS
		}

		const A = generateMatrix(y_0.length, sigma)
		let y = [...y_0]
		for(let i = 0; i < nt; i++) {
			const y_temp = [].concat(y)
			const b = generateRHS(y_temp, sigma)
			
			const y_interior = numeric.solve(A, b)
			y = [...y_interior]
			y.unshift(y_0[0])
			y.push(y_0[y.length-2])
		}
		return y
	}
}
