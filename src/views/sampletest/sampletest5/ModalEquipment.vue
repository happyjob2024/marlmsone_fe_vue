<template>
    <teleport to="body">
        <div class="backdrop">
            <div class="container" style="width: 500px">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <p class="conTitle">
                                <span>장비등록</span>
                            </p>
                        </div>
                        <div class="modal-body">
                            <div class="input-group mb-3" v-if="equipId">
                                <span class="input-group-text">강의실 명</span>
                                <input type="text" class="form-control" v-model="equipment.lecrm_name" disabled />
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">장비 명</span>
                                <input type="text" class="form-control" v-model="equipment.equ_name" />
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">장비 수</span>
                                <input
                                    type="text"
                                    class="form-control"
                                    oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')"
                                    v-model="equipment.equ_num"
                                />
                            </div>
                            <div class="input-group mb-3">
                                <span class="input-group-text">비고</span>
                                <input type="text" class="form-control" v-model="equipment.equ_note" />
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-info" @click="postEquipmentDetail" v-if="!equipId">
                                등록
                            </button>
                            <template v-else>
                                <button type="button" class="btn btn-info" @click="postEquipmentDetail">수정</button>
                                <button type="button" class="btn btn-info" @click="deleteEquimentDetail">삭제</button>
                            </template>
                            <button type="button" class="btn btn-light" @click="$emit('closeModal', false)">
                                닫기
                            </button>
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
    equipId: Number,
});

const emit = defineEmits(['closeAndSearch']);

const equipment = ref(new Object());
const updateHandler = ref(props.equipId ? 'U' : 'I');

const postEquipmentDetail = () => {
    let param = new URLSearchParams(equipment.value);
    param.append('action', updateHandler.value);
    param.append('lecrm_id', props.lectureId);

    axios.post('/adm/equSave.do', param).then((res) => {
        if (res.data.result === 'S') {
            alert(res.data.resultmsg);
            emit('closeAndSearch', false);
        }
    });
};

const getEquipmentDetail = () => {
    let param = new URLSearchParams();
    param.append('equ_id', props.equipId);

    axios.post('/adm/equDtl.do', param).then((res) => {
        equipment.value = res.data.selinfo;
    });
};

const deleteEquimentDetail = () => {
    let param = new URLSearchParams();
    param.append('equ_id', props.equipId);
    axios.post('/adm/equDelete.do', param).then((res) => {
        if (res.data.result === 'S') {
            alert(res.data.resultmsg);
            emit('closeAndSearch', false);
        }
    });
};

onMounted(() => {
    props.equipId ? getEquipmentDetail() : null;
});
</script>

<style>
.backdrop {
    display: flex;
    position: fixed;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
}
.container {
    background: white;
    padding: 1.5rem;
    height: 50%;
}
</style>
