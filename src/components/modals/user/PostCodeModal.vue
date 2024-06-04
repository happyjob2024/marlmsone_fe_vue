<script setup>
import { VueDaumPostcode } from "vue-daum-postcode";

const emit = defineEmits(["closeModal", "complete"]);

const closeModal = (event) => {
    if (!event) {
        emit("closeModal");
    } else if (event.target.classList.contains("background")) {
        emit("closeModal");
    }
};

const complete = (data) => {
    emit("complete", data);
};
</script>

<template>
    <div class="modal show">
        <div class="background" @click="closeModal">
            <div class="main">
                <div class="container">
                    <VueDaumPostcode @complete="complete" />
                </div>
                <button
                    class="btn btn-primary"
                    style="float: right"
                    @click="closeModal()"
                >
                    닫기
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    width: 600px;
    height: 400px;
    overflow-y: scroll;
}
</style>
