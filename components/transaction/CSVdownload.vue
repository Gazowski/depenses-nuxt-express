<script setup lang="ts">
    import FileUpload from 'primevue/fileupload';
    import ProgressBar from 'primevue/progressbar';
    import Message from 'primevue/message';
  
    const uploading = ref(false);
    const uploadProgress = ref(0);
    const uploadMessage = ref('');
    const uploadStatus = ref('info');
    const selectedFile = ref('');
    const config = useRuntimeConfig();
    const uploadApiUrl = `${config.public.apiBase}/api/transactions/upload/`;
    
    const onSelect = (event: any) => {
        // Logique de validation du fichier si nécessaire
        console.log('Fichier sélectionné:', event.files[0].name);
        selectedFile.value = event.files[0];
        const reader = new FileReader();
        reader.readAsText(new Blob([selectedFile.value]), 'UTF-8');
            reader.onload = function(event) {
            console.log(event.target.result);  // This should show the CSV content with accents
        };

    };
    
    const handleUpload = () => {
        uploading.value = true;
        uploadProgress.value = 0;
        
        const formData = new FormData();
        formData.append('file', selectedFile.value);


        // api is https://localhost:3003/api/upload
        fetch(uploadApiUrl, {
            method: 'POST',
            body: formData,
        })
        // .then(response => response.json())
        .then(data => {
            uploadProgress.value = 100;
            uploadMessage.value = 'Fichier téléchargé avec succès!';
            uploadStatus.value = 'success';
        })
        .catch((error) => {
            console.error('Error:', error);
            uploadMessage.value = "Erreur lors du téléchargement du fichier.";
            uploadStatus.value = 'error';
        })
        .finally(() => {
            uploading.value = false;
        });
    };
</script>


<template>
    <div class="csv-upload">
        <h4>Ajouter un relevé CSV</h4>
        <FileUpload
            name="csvFile"
            mode="basic"
            url="http://localhost:3003/api/upload/"
            :maxFileSize="1000000"
            accept=".csv"
            @select="onSelect"
            @upload="handleUpload"
            customUpload
            chooseLabel="Choisir un fichier"
            class="p-button-outlined"
        />
        <Button 
            @click="handleUpload" 
            class="mt-2">
            Télécharger
        </Button>
        <ProgressBar 
            v-if="uploading" 
            :value="uploadProgress" 
        />
        <Message 
            v-if="uploadMessage" 
            :severity="uploadStatus" 
            :closable="true">
            {{ uploadMessage }}
        </Message>
    </div>
</template>
  
<style scoped>
    .csv-upload {
        display: grid;
        justify-items: center;
        gap: .5rem;
    }
</style>