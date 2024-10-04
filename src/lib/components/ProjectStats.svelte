<script lang="ts">
    export let project: any;
    
    function calculateProgress(raised: number, goal: number) {
        return Math.min(100, (raised / goal) * 100);
    }
    </script>
    
    <div class="bg-white shadow-md rounded-lg p-6">
        <h3 class="text-xl font-semibold mb-4">{project.title}</h3>
        <p class="text-gray-600 mb-4">{project.description}</p>
        <div class="grid grid-cols-2 gap-4">
            <div>
                <p class="text-sm text-gray-500">Raised</p>
                <p class="text-lg font-semibold">${project.raised.toLocaleString()}</p>
            </div>
            <div>
                <p class="text-sm text-gray-500">Goal</p>
                <p class="text-lg font-semibold">${project.goal.toLocaleString()}</p>
            </div>
            <div>
                <p class="text-sm text-gray-500">Valuation</p>
                <p class="text-lg font-semibold">${project.valuation.toLocaleString()}</p>
            </div>
            <div>
                <p class="text-sm text-gray-500">Min. Investment</p>
                <p class="text-lg font-semibold">${project.minInvestment.toLocaleString()}</p>
            </div>
        </div>
        <div class="mt-4">
            <div class="bg-gray-200 rounded-full h-2 mb-2">
                <div class="bg-blue-600 h-2 rounded-full" style="width: {calculateProgress(project.raised, project.goal)}%"></div>
            </div>
            <p class="text-sm text-gray-600">{calculateProgress(project.raised, project.goal).toFixed(1)}% funded</p>
        </div>
    </div>