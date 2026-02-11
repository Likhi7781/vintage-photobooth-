from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.conf import settings
import os

@csrf_exempt
def upload_photo(request):
    if request.method == "POST" and request.FILES.get("photo"):

        photo = request.FILES["photo"]
        filename = "capture.png"

        path = default_storage.save(f"photos/{filename}", photo)

        return JsonResponse({
            "image": request.build_absolute_uri(
                settings.MEDIA_URL + path
            )
        })

    return JsonResponse({"error": "Invalid request"}, status=400)
