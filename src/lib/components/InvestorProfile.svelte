<script lang="ts">
    export let investor: any;
    
    function formatPreference(pref: string) {
        return pref.charAt(0).toUpperCase() + pref.slice(1);
    }
    </script>
    
    <div class="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Your Investor Profile</h2>
        <div class="grid grid-cols-2 gap-4">
            <div>
                <p class="text-gray-600">Profession</p>
                <p class="font-semibold">{investor.profession}</p>
            </div>
            <div>
                <p class="text-gray-600">Investment Preference</p>
                <p class="font-semibold">{formatPreference(investor.investmentPreference)}</p>
            </div>
        </div>
    </div>