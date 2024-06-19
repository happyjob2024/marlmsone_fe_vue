<template>
<teleport to="body">
    <div class="modal-overlay">
        <div class="container" style="width: 650px; height:350px">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <p class="conTitle">
                            <span>장비 등록</span>
                        </p>
                    </div>
                    <div class="modal-body" style="width: 600px; height: 180px;">
                        <table class="table table-bordered">
                            <colgroup>
                                <col width="25%">
                                <col width="25%">
                                <col width="25%">
                                <col width="25%">
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th scope="row">장비 명<span class="font_red">*</span></th>
                                    <td colspan="3"><input type="text" class="inputTxt p100" v-model="equture.equ_name"/></td>
                                </tr>
                                <tr>
                                    <th>장비 수<span class="font_red">*</span></th>
                                    <td>
                                        <input type="text" 
                                            class="inputTxt p100"
                                            oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')"
                                            v-model="equture.equ_num"
                                        />
                                    </td>
                                    <th>강의실<span class="font_red">*</span></th>
                                    <td class="t-data">
                                        <select v-model="equture.lecrm_id">
                                            <option v-for="option in roomList"
                                                :key="option.lecrm_id"
                                                :value="option.lecrm_id"
                                            >{{ option.lecrm_name}}
                                            </option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">비고</th>
                                    <td colspan="3"><input type="text" class="inputTxt p100" v-model="equture.equ_note"/></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-info"  @click="getNewEquipemnt" v-if="!equId">등록</button>
                        <template v-else>
                            <button class="btn btn-info" @click="getNewEquipemnt">수정</button>
                            <button class="btn btn-info" @click="getDelteEquipemnt">삭제</button>
                        </template>
                        <button class="btn btn-light" @click="$emit('closeModal', false)">닫기</button>
                    </div>
                </div>  
            </div>
        </div>
    </div>
</teleport>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

 

const props = defineProps({
    lectureId: Number,
    equId: Number,
});

const emit = defineEmits(['closeAndSearch']);
const equture = ref(new Object());
const roomList = ref({});
const updateHandler = ref(props.equId ? 'U' : 'I');

const getEquipmentDetail = () => {
    let param = new URLSearchParams();

    param.append('equ_id', props.equId);

    axios.post('/adm/equManagementJson.do', param).then((res) => {
        equture.value = res.data.selinfo;
        roomList.value = res.data.roomlist;

    });
};

const getDetail = () => {
    let param = new URLSearchParams();

    param.append('equ_id', props.equId);

    axios.post('/adm/equManagementJson.do', param).then((res) => {
       // equture.value = res.data.selinfo;
        roomList.value = res.data.roomlist;

    });
};

const getNewEquipemnt = () => {
    let param = new URLSearchParams(equture.value);
    param.append('action', updateHandler.value);
    param.append('lecrm_id', props.lectureId);

    axios.post('adm/equSave.do', param).then((res) => {
        if(res.data.result === 'S') {
            alert(res.data.resultmsg);
            emit('closeAndSearch', false);
        }
    });
};

const getDelteEquipemnt = () => {
    let param = new URLSearchParams();
    param.append('equ_id', props.equId);

    axios.post('adm/equDelete.do' , param).then((res) => {
        if(res.data.result === 'S') {
            alert(res.data.resultmsg);
            emit('closeAndSearch', false);
        }
    });
}

onMounted (() => {

    props.equId ?  getEquipmentDetail() : getDetail()   
 
});


</script>

<style>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
.container {
    background: white;
    padding: 1.5rem;
    height: 50%;
}
</style>