<template>
    <div>
        <p class="Location">
            <span class="btn_nav bold">시설 관리</span>
            <span class="btn_nav bold"> 강의실</span>
        </p>
        <p class="conTitle">
            <span v-if="id">강의실 상세조회</span>
            <span v-else>강의실 신규등록</span>
            <button class="btn btn-light" style="float: inline-end; margin-top: 10px" @click="router.back()">
                돌아가기
            </button>
        </p>
        <div>
            <div class="input-group mb-3">
                <span class="input-group-text">강의실 명</span>
                <input type="text" class="form-control" v-model="lecture.lecrm_name" />
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text">크기</span>
                <input
                    type="text"
                    class="form-control"
                    oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')"
                    v-model="lecture.lecrm_size"
                />
                <span class="input-group-text">자릿수</span>
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
        <div class="btn-family">
            <button class="btn btn-light" style="float: inline-end" @click="deleteLectureDetail">
                <span>삭제</span>
            </button>
            <button class="btn btn-info" style="float: inline-end" @click="postLectureDetail">
                <span>저장</span>
            </button>
        </div>

        <div>
            <EquipmentList />
        </div>
    </div>
</template>

<script setup>
import { nullcheck } from '@/common/common';
import axios from 'axios';
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EquipmentList from './EquipmentList.vue';

const route = useRoute();
const router = useRouter();
const id = ref(route.params.id);
const lecture = reactive({ lecrm_name: '', lecrm_size: 0, lecrm_snum: 0, lecrm_note: '' });
const updateHandler = ref(id.value ? 'U' : 'I');
let preLecture = Object;

const getLectureDetail = (id) => {
    let param = new URLSearchParams();
    param.append('lecrm_id', id);
    axios.post('/adm/lectureRoomDtl.do', param).then((res) => {
        lecture.lecrm_name = res.data.selinfo.lecrm_name;
        lecture.lecrm_size = res.data.selinfo.lecrm_size;
        lecture.lecrm_snum = res.data.selinfo.lecrm_snum;
        lecture.lecrm_note = res.data.selinfo.lecrm_note;
        preLecture = { ...lecture };
    });
};

const postLectureDetail = () => {
    let checkresult = nullcheck([
        { inval: lecture.lecrm_name, msg: '강의실 명을 입력해 주세요.' },
        { inval: lecture.lecrm_size, msg: '강의실 크기을 입력해 주세요.' },
        { inval: lecture.lecrm_snum, msg: '강의실 자리수을 입력해 주세요.' },
    ]);
    if (!checkresult) return;

    let param = new URLSearchParams(lecture);
    param.append('action', updateHandler.value);
    id.value ? param.append('lecrm_id', id.value) : null;

    axios
        .post('/adm/lectureRoomSave.do', param)
        .then((res) => {
            if (res.data.result === 'S') {
                alert('저장되었습니다.');
                router.push('/dashboard/sampletest/samplepage5');
            }
        })
        .catch((err) => {
            alert(err.message);
        });
};

const deleteLectureDetail = () => {
    let param = new URLSearchParams();
    param.append('lecrm_id', id.value);
    axios.post('/adm/lectureRoomDelete.do', param).then((res) => {
        if (res.data.result === 'S') {
            alert('삭제되었습니다');
            router.push('/dashboard/sampletest/samplepage5');
        }
    });
};

watch(lecture, (newData) => {
    if (newData.lecrm_name.length > 15) {
        alert('15자 이상입니다.');
        lecture.lecrm_name = preLecture.lecrm_name;
    }
});

onMounted(() => {
    id.value ? getLectureDetail(id.value) : null;
});
</script>

<style></style>
