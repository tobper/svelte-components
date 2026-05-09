<script lang="ts">
	type Key =
		// Modifiers
  		| 'alt'
		| 'control'
		| 'meta'
		| 'shift'
		// Special keys
		| 'backspace'
		| 'enter'
		| 'space'
		| 'tab'
		// Other
		| string

  interface KbdProps {
    key: Key | Key[]
  }

  let { key: keys }: KbdProps = $props();
  let mac = navigator.userAgent.includes('Mac OS');
</script>

<kbd class="kbd">
  {#each Array.isArray(keys) ? keys : [keys] as key (key)}
    {#if key ===  'alt' && mac}
      <!-- material-symbols-light:keyboard-option-key-rounded -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M16.002 18.5q-.435 0-.804-.212t-.594-.596L8.312 6.808q-.096-.154-.231-.231T7.792 6.5H4.5q-.213 0-.356-.144T4 5.999t.144-.356T4.5 5.5h3.273q.435 0 .804.212t.594.596l6.293 10.884q.095.154.23.231t.289.077H19.5q.213 0 .356.144t.144.357t-.144.356t-.356.143zM16 6.5q-.213 0-.356-.144t-.144-.357t.144-.356T16 5.5h3.5q.213 0 .356.144t.144.357t-.144.356t-.356.143z"/></svg>
    {:else if key === 'control'}
      <!-- material-symbols-light:keyboard-control-key-rounded -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m12 7.114l-5.265 5.24q-.14.14-.332.134q-.191-.007-.337-.154q-.141-.14-.141-.344t.14-.344l5.37-5.369q.242-.243.565-.243t.566.243l5.388 5.388q.14.14.133.342t-.153.347q-.14.14-.334.14t-.334-.14z"/></svg>
    {:else if key === 'meta'}
      {#if mac}
        <!-- material-symbols-light:keyboard-command-key -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M6.5 20.5q-1.258 0-2.129-.871T3.5 17.5t.871-2.129T6.5 14.5h2v-5h-2q-1.258 0-2.129-.871T3.5 6.5t.871-2.129T6.5 3.5t2.129.871T9.5 6.5v2h5v-2q0-1.258.871-2.129T17.5 3.5t2.129.871T20.5 6.5t-.871 2.129T17.5 9.5h-2v5h2q1.258 0 2.129.871T20.5 17.5t-.871 2.129t-2.129.871t-2.129-.871T14.5 17.5v-2h-5v2q0 1.258-.871 2.129T6.5 20.5m0-1q.817 0 1.409-.591q.591-.592.591-1.409v-2h-2q-.817 0-1.409.591q-.591.592-.591 1.409t.591 1.409T6.5 19.5m11 0q.817 0 1.409-.591q.591-.592.591-1.409t-.591-1.409T17.5 15.5h-2v2q0 .817.591 1.409q.592.591 1.409.591m-8-5h5v-5h-5zm-3-6h2v-2q0-.817-.591-1.409Q7.317 4.5 6.5 4.5t-1.409.591T4.5 6.5t.591 1.409Q5.683 8.5 6.5 8.5m9 0h2q.817 0 1.409-.591q.591-.592.591-1.409t-.591-1.409T17.5 4.5t-1.409.591Q15.5 5.683 15.5 6.5z"/></svg>
      {:else}
        <!-- bi:windows -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M6.555 1.375L0 2.237v5.45h6.555zM0 13.795l6.555.933V8.313H0zm7.278-5.4l.026 6.378L16 16V8.395zM16 0L7.33 1.244v6.414H16z"/></svg>
      {/if}
    {:else if key === 'shift'}
      <!-- bi:shift -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 20 20"><path fill="currentColor" d="M7.27 2.047a1 1 0 0 1 1.46 0l6.345 6.77c.6.638.146 1.683-.73 1.683H11.5v3a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-3H1.654C.78 10.5.326 9.455.924 8.816zM14.346 9.5L8 2.731L1.654 9.5H4.5a1 1 0 0 1 1 1v3h5v-3a1 1 0 0 1 1-1z"/></svg>
    {:else if key === 'backspace'}
      <!-- material-symbols-light:backspace-outline-rounded -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path fill="currentColor" d="m13.654 12.708l2.246 2.246q.14.14.344.15t.364-.15t.16-.354t-.16-.354L14.362 12l2.246-2.246q.14-.14.15-.344t-.15-.364t-.354-.16t-.354.16l-2.246 2.246l-2.246-2.246q-.14-.14-.344-.15q-.205-.01-.364.15q-.16.16-.16.354t.16.354L12.946 12L10.7 14.246q-.14.14-.15.345q-.01.203.15.363t.354.16t.354-.16zM9.173 19q-.379 0-.727-.164q-.348-.165-.565-.463l-4.135-5.385q-.342-.447-.342-.988t.342-.988l4.135-5.385q.217-.298.565-.462T9.173 5h10.212q.67 0 1.143.472q.472.472.472 1.144v10.769q0 .67-.472 1.143q-.472.472-1.143.472zm0-1h10.212q.269 0 .442-.173t.173-.442V6.615q0-.269-.173-.442T19.385 6H9.173q-.154 0-.279.058t-.221.173l-4.134 5.385q-.135.173-.135.384t.134.385l4.135 5.384q.096.116.221.173t.279.058m3.02-6"/></svg>
    {:else if key === 'enter'}
      <!-- material-symbols-light:keyboard-return-rounded -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m5.916 12.5l3.746 3.746q.14.14.15.345q.01.203-.15.363t-.354.16t-.354-.16l-4.389-4.389q-.13-.13-.183-.267q-.053-.136-.053-.298t.053-.298t.184-.267l4.388-4.389q.14-.14.344-.15t.364.15t.16.354t-.16.354L5.916 11.5h12.469q.269 0 .442-.173t.173-.442V8q0-.213.143-.357T19.5 7.5t.357.143T20 8v2.885q0 .67-.472 1.143q-.472.472-1.143.472z"/></svg>
    {:else if key === 'space'}
      <!-- material-symbols-light:space-bar-rounded -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path fill="currentColor" d="M6.616 14q-.667 0-1.141-.475T5 12.385V9.5q0-.213.144-.356T5.501 9t.356.144T6 9.5v2.885q0 .269.173.442t.443.173h10.769q.269 0 .442-.173t.173-.442V9.5q0-.213.144-.356T18.501 9t.356.144T19 9.5v2.885q0 .666-.475 1.14t-1.14.475z"/></svg>
    {:else if key === 'tab'}
      <!-- material-symbols-light:keyboard-tab-rounded -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M20.143 17.357Q20 17.214 20 17V7q0-.213.143-.357T20.5 6.5t.357.143T21 7v10q0 .214-.143.357t-.357.143t-.357-.143m-4.43-4.857H3.5q-.213 0-.357-.143T3 12t.143-.357t.357-.143h12.194l-3.721-3.765q-.14-.14-.133-.332q.006-.191.152-.337q.14-.141.344-.141q.205 0 .345.14l4.369 4.37q.13.13.184.267q.052.137.052.298t-.052.298t-.184.268l-4.389 4.388q-.14.14-.34.14t-.348-.14q-.165-.146-.156-.357q.01-.21.156-.357z"/></svg>
    {:else}
      <span>{key}</span>
    {/if}
  {/each}
</kbd>
