import { schemes } from "../schemes/schemes.js"

export const convection = {
	explicit: {
		_1D: (u, u_i, i, dt, dx, c) => schemes.explicit.forwardTimeEuler._1D(u, u_i, i) - c * dt / dx * schemes.explicit.backwardSpaceEuler._1D(u, u_i, i)
	},
	implicit : {
		_1D: (dx, dt, nu, c) => {
			return {
				ud: schemes.implicit.backwardTimeEuler._1D(dx, dt, c).ud + schemes.implicit.backwardSpaceEuler._1D(dx, dt, c).ud,
				d: schemes.implicit.backwardTimeEuler._1D(dx, dt, c).d + schemes.implicit.backwardSpaceEuler._1D(dx, dt, c).d,
				ld: schemes.implicit.backwardTimeEuler._1D(dx, dt, c).ld + schemes.implicit.backwardSpaceEuler._1D(dx, dt, c).ld,
			}
		}
	}
}
