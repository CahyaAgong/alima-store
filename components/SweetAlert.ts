import Swal from 'sweetalert2';

export const showAlert = (
  title: string,
  text: string,
  icon: 'success' | 'error' | 'warning' | 'info' = 'success'
) => {
  Swal.fire({
    title,
    text,
    icon,
    confirmButtonText: 'OK',
  });
};

export const showConfirmationDialog = async (
  title: string,
  text: string
): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });

  return result.isConfirmed;
};
