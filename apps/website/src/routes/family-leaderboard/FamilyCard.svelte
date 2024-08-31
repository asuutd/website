<script lang="ts">
    import * as Avatar from "$lib/../components/ui/avatar";
    export let name: string;
    export let position: number;
    export let points: number;
    export let member_names: string[];
</script>
<div class="bg-background rounded-lg p-4 flex items-center justify-between">
    <div class="flex items-center gap-4">
        <div class="bg-primary rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
            {position}
        </div>
        <div>
            <h3 class="text-lg font-medium">{name}</h3>
            <p class="text-muted-foreground">{points.toLocaleString()} points</p>
        </div>
    </div>
    <div class="flex items-center gap-2 flex-wrap">
        {#each member_names as member_name}
            <Avatar.Root>
                <Avatar.Fallback>
                    {member_name
                        .split(/(?:\s|-)+/)
                        .map(name => name.slice(0, 1))
                        .join('')
                        .toUpperCase()}
                </Avatar.Fallback>
            </Avatar.Root>
        {/each}
    </div>
</div>