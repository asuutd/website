<script lang="ts">
    export let memberName: string;
    export let position: number;
    export let points: number;
    export let familyName: string;
</script>

<div class="bg-background rounded-lg p-4 flex items-center justify-between">
    <div class="flex items-center gap-4">
        <div class="bg-primary rounded-full w-8 h-8 flex items-center justify-center text-primary-foreground font-bold">
            {position}
        </div>
        <div>
            <h3 class="text-lg font-medium">{memberName}</h3>
            <p class="text-muted-foreground">{points.toLocaleString()} points</p>
        </div>
    </div>
    <div>
        <p class="text-muted-foreground">{familyName}</p>
    </div>
</div>