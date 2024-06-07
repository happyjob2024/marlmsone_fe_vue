<template>
<teleport to="body">
    <div class="backdrop">
        <div class="container" style="width: 500px">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<p class="conTitle">
							<span>강의실 등록</span>
						</p>
					</div>
					<div class="modal-body">
						<div class="input-group mb-3">
							<span class="input-group-text">강의실 명</span>
							<input type="text" class="form-control" v-model="lecture.lecrm_name"/>
						</div>
						<div class="input-group mb-3">
							<span class="input-group-text">강의실 크기</span>
							<input type="text" class="form-control" v-model="lecture.lecrm_size" />
						</div>
						<div class="input-group mb-3">
							<span class="input-group-text">강의실 자리수</span>
							<input
								type="text"
								class="form-control"
								oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')"
								v-model="lecture.lecrm_snum"
							/>
						</div>
						<div class="input-group mb-3">
							<span class="input-group-text">비고</span>
							<input type="text" class="form-control" v-model="lecture.lecrm_note" />
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-info" @click="getNewRegistration" v-if="!lecrmId">
							등록
						</button>
						<template v-else>
							<button type="button" class="btn btn-info" @click="getNewRegistration">수정</button>
							<button type="button" class="btn btn-info" @click="getDeleteNewRegistration">삭제</button>
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
import {  onMounted, ref } from 'vue';


const props = defineProps({
    lectureId: Number,
    lecrmId: Number,
});

const emit = defineEmits(['closeAndSearch']);

const lecture = ref(new Object());
const updateHandler = ref(props.lecrmId ? 'U' : 'I');

const getLectureDetail = () => {
    let param = new URLSearchParams();
    param.append('lecrm_id', props.lecrmId);

    axios.post('/adm/lectureRoomDtl.do', param).then((res) => {
        lecture.value = res.data.selinfo;
    });
};

const getNewRegistration = () => {

    let param = new URLSearchParams(lecture.value);
    param.append('action', updateHandler.value);
    param.append('lecrm_id', props.lectureId);

    axios.post('adm/lectureRoomSave.do' , param).then((res) => {
        if(res.data.result === 'S') {
            alert(res.data.resultmsg);
            emit('closeAndSearch', false);
        }
    });
};

const getDeleteNewRegistration = () => {
    let param = new URLSearchParams();
    param.append('lecrm_id', props.lecrmId);
    axios.post('adm/lectureRoomDelete.do' , param).then((res) => {
        if(res.data.result === 'S') {
            alert(res.data.resultmsg);
            emit('closeAndSearch', false);
        }
    });

}

onMounted(() => {
    props.lecrmId ? getLectureDetail() : null;
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