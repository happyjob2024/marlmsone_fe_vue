<template>
  <div id="equ">
    <p class="conTitle">
    <span>장비 목록</span> 
    <span class="fr">
    <div class="btn_areaC mt30">
		<button class="btn btn-outline-dark" @click="router.back()" 
        style="float: inline-end; margin-top: -10px"
        >돌아가기</button>			
	</div>
    </span> 
        <!-- <a class="btnType blue" href="javascript:newRegEqu();" name="newRegEqu" id="newRegEqu"><span>장비 신규등록</span></a> -->
        
    </p>
    <div class="divEquList divComGrpCodList">
        <table class="col">
            <caption>caption</caption>
            <colgroup>
                <col width="25%">
                <col width="20%">
                <col width="15%">
                <col width="40%">
                <col width="15%">
            </colgroup>

            <thead>
                <tr>
                    <th scope="col">강의실 명</th>
                    <th scope="col">장비 명</th>
                    <th scope="col">장비 수</th>
                    <th scope="col">비고</th>
                </tr>
            </thead>
            
            <tbody id="listEquBody">
                <tr v-for="data in dataList" :key="data.lecrm_id">
                    <td>{{ data.lecrm_name }}</td>
                    <td>{{ data.equ_name }}</td>
                    <td>{{ data.equ_num }}</td>
                    <td>{{ data.equ_note }}</td>
                </tr>
            </tbody>
        </table>
        
    </div>
</div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { axiosAction } from '.';
import { EquipmentList } from '@/api/api';

const route = useRoute();
const router = useRouter();
const lectureId = ref(route.params.id);
const dataList = ref([]);
const currentPage = ref(0);
const total = ref(0);

const getEquipmentList = async (cpage) => {
    cpage = cpage || 1;
    let param = new URLSearchParams();
    param.append('cpage', cpage);
    param.append('pagesize', 5);
    param.append('lecrm_id', lectureId.value);

    const equipmentList = await axiosAction(EquipmentList.equList,param);
    if(equipmentList) {
        dataList.value = equipmentList.listdata;
        total.value = equipmentList.listdcnt;
        currentPage.value = cpage;
    }

};

onMounted(() => {
    getEquipmentList();
});
</script>

<style>

</style>