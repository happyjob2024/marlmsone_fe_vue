<template>
    <div class="col-sm-4">
        <div class="card" style="min-height: 150px">
            <div class="card-body">
                <!-- listdata": [{"lecrm_id": 92,"lecrm_name": "111","lecrm_size": "10","lecrm_snum": 5,
                             "lecrm_note": "111","equ_id": 0,"equ_name": null,"equ_num": 0,"equ_note": null}] -->
                <h5 class="card-title" style="text-align: center">{{ data.lecrm_name }}</h5>
                <p class="card-text" style="min-height: 40px">{{ data.lecrm_note }}</p>
                <a class="btn btn-info btn-sm" @click="$router.push(`detail/${data.lecrm_id}`)">상세보기</a>
            </div>
        </div>
    </div>
</template>

<script setup>
    defineProps({
        data: Object,
    });
</script>

<style>
.col-sm-4 {
    margin-bottom: 10px;
}
.card {
    width: 100%;
}

.btn-sm {
    float: right;
}
</style>
