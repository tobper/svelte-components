<script lang="ts">
	interface Loading {
		class?: string | undefined | null;
		small?: boolean;
		large?: boolean;
		visible?: boolean;
		ball?: boolean;
		bars?: boolean;
		dots?: boolean;
		ring?: boolean;
		spinner?: boolean;
	}

	let {
		small = false,
		large = false,
		visible = true,
		ball = false,
		bars = false,
		dots = false,
		ring = false,
		spinner = false,
		...props
	}: Loading = $props();
</script>
 
 <span
	class:hidden={!visible}
	class:small
	class:large
	class:ball
	class:bars
	class:dots
	class:ring
	class:spinner={spinner || (!ball && !bars && !dots && !ring)}
	role="status"
	{...props}
></span>
 
 <style>
	span {
	  mask-size: 100%;
	  mask-repeat: no-repeat;
	  mask-position: center;
	  pointer-events: none;
	  display: block;
	  background-color: currentColor;
 
	  width: 1.5rem;
	  aspect-ratio: 1;
	}
 
	.hidden {
	  display: none;
	}
 
	.small {
	  width: 1.25rem;
	}
 
	.large {
	  width: 2rem;
	}
 
	.ball {
	  mask-image: url("data:image/svg+xml,%0A%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E.spinner_rXNP%7Banimation:spinner_YeBj .8s infinite%7D@keyframes spinner_YeBj%7B0%25%7Banimation-timing-function:cubic-bezier(0.33,0,.66,.33);cy:5px%7D46.875%25%7Bcy:20px;rx:4px;ry:4px%7D50%25%7Banimation-timing-function:cubic-bezier(0.33,.66,.66,1);cy:20.5px;rx:4.8px;ry:3px%7D53.125%25%7Brx:4px;ry:4px%7D100%25%7Bcy:5px%7D%7D%3C/style%3E%3Cellipse class='spinner_rXNP' cx='12' cy='5' rx='4' ry='4'/%3E%3C/svg%3E");
	}
 
	.bars {
	  mask-image: url("data:image/svg+xml,%0A%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E.spinner_hzlK%7Banimation:spinner_vc4H .8s linear infinite;animation-delay:-.8s%7D.spinner_koGT%7Banimation-delay:-.65s%7D.spinner_YF1u%7Banimation-delay:-.5s%7D@keyframes spinner_vc4H%7B0%25%7By:1px;height:22px%7D93.75%25%7By:5px;height:14px;opacity:.2%7D%7D%3C/style%3E%3Crect class='spinner_hzlK' x='1' y='1' width='6' height='22'/%3E%3Crect class='spinner_hzlK spinner_koGT' x='9' y='1' width='6' height='22'/%3E%3Crect class='spinner_hzlK spinner_YF1u' x='17' y='1' width='6' height='22'/%3E%3C/svg%3E");
	}
 
	.dots {
	  mask-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E.spinner_qM83%7Banimation:spinner_8HQG 1.05s infinite%7D.spinner_oXPr%7Banimation-delay:.1s%7D.spinner_ZTLf%7Banimation-delay:.2s%7D@keyframes spinner_8HQG%7B0%25,57.14%25%7Banimation-timing-function:cubic-bezier(0.33,.66,.66,1);transform:translate(0)%7D28.57%25%7Banimation-timing-function:cubic-bezier(0.33,0,.66,.33);transform:translateY(-6px)%7D100%25%7Btransform:translate(0)%7D%7D%3C/style%3E%3Ccircle class='spinner_qM83' cx='4' cy='12' r='3'/%3E%3Ccircle class='spinner_qM83 spinner_oXPr' cx='12' cy='12' r='3'/%3E%3Ccircle class='spinner_qM83 spinner_ZTLf' cx='20' cy='12' r='3'/%3E%3C/svg%3E");
	}
 
	.ring {
	  mask-image: url("data:image/svg+xml,%3Csvg width='44' height='44' viewBox='0 0 44 44' xmlns='http://www.w3.org/2000/svg' stroke='%23fff'%3E%3Cg fill='none' fill-rule='evenodd' stroke-width='2'%3E%3Ccircle cx='22' cy='22' r='1'%3E%3Canimate attributeName='r' begin='0s' dur='1.8s' values='1; 20' calcMode='spline' keyTimes='0; 1' keySplines='0.165, 0.84, 0.44, 1' repeatCount='indefinite' /%3E%3Canimate attributeName='stroke-opacity' begin='0s' dur='1.8s' values='1; 0' calcMode='spline' keyTimes='0; 1' keySplines='0.3, 0.61, 0.355, 1' repeatCount='indefinite' /%3E%3C/circle%3E%3Ccircle cx='22' cy='22' r='1'%3E%3Canimate attributeName='r' begin='-0.9s' dur='1.8s' values='1; 20' calcMode='spline' keyTimes='0; 1' keySplines='0.165, 0.84, 0.44, 1' repeatCount='indefinite' /%3E%3Canimate attributeName='stroke-opacity' begin='-0.9s' dur='1.8s' values='1; 0' calcMode='spline' keyTimes='0; 1' keySplines='0.3, 0.61, 0.355, 1' repeatCount='indefinite' /%3E%3C/circle%3E%3C/g%3E%3C/svg%3E");
	}
 
	.spinner {
	  mask-image: url("data:image/svg+xml,%3Csvg width='24' height='24' stroke='%23000' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E.spinner_V8m1%7Btransform-origin:center;animation:spinner_zKoa 2s linear infinite%7D.spinner_V8m1 circle%7Bstroke-linecap:round;animation:spinner_YpZS 1.5s ease-in-out infinite%7D%40keyframes spinner_zKoa%7B100%25%7Btransform:rotate(360deg)%7D%7D%40keyframes spinner_YpZS%7B0%25%7Bstroke-dasharray:0 150;stroke-dashoffset:0%7D47.5%25%7Bstroke-dasharray:42 150;stroke-dashoffset:-16%7D95%25%2C100%25%7Bstroke-dasharray:42 150;stroke-dashoffset:-59%7D%7D%3C%2Fstyle%3E%3Cg class='spinner_V8m1'%3E%3Ccircle cx='12' cy='12' r='9.5' fill='none' stroke-width='1.5'%3E%3C%2Fcircle%3E%3C%2Fg%3E%3C%2Fsvg%3E");
	}
 </style>
 