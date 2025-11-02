<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Background, ContentContainer, Header, MainContainer } from 'imbento-box-ui';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<MainContainer>
	<Background pattern="stagStar" color="blue" animate={false} />
	<Header>Plus One</Header>
	<ContentContainer>
		{@render children?.()}
	</ContentContainer>
</MainContainer>
