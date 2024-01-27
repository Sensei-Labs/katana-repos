import { LoginDiscordInfoType, UserInfo } from '@/Contexts/Scope/types';
import { createAvatar } from '@/utils/createAvatar';
import { api } from '@/services/api';
import { API_UPLOAD_FILE } from '@/config';
import { updateUser } from '@/fetches/auth';

export default async function createAvatarForUser(
  discordInfo: LoginDiscordInfoType,
  dataLogin: {
    jwt: string;
    user: UserInfo;
  }
) {
  const file = createAvatar(`${discordInfo.email} ${discordInfo.username}`);
  const formData = new FormData();
  formData.append('files', file);

  const { data: dataAvatarUpload } = await api.post<FileServerType[]>(
    API_UPLOAD_FILE,
    formData,
    {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `Bearer ${dataLogin.jwt}`
      }
    }
  );

  if (dataAvatarUpload.length) {
    const img = dataAvatarUpload[0];
    const { data: updateUserData } = await updateUser(
      dataLogin?.user?.id,
      { avatar: img?.url },
      { headers: { Authorization: `Bearer ${dataLogin.jwt}` } }
    );

    dataLogin.user = updateUserData;
  }
}
