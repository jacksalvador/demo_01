var map, marker1;
let lat, lon;

function initTmap() {

    // 1. 지도 띄우기
    map = new Tmapv2.Map("map_div", {
        center : new Tmapv2.LatLng(37.574989, 126.896907),
        width : "100%",
        height : "500px",
        zoom : 17,
        zoomControl : true,
        scrollwheel : true

    });
    // 마커 초기화
    marker1 = new Tmapv2.Marker(
        {
            icon : "img/pin_map_google_icon.png",
            iconSize : new Tmapv2.Size(38, 38),
            map : map
        });

    $("#btn_select").click(function() {
        // 2. API 사용요청
        var fullAddr = $("#fullAddr").val();
        var headers = {}; 
        headers["appKey"]="3oBTY2lRKl35FpTvZ93WA8G6YUAoKtbxmdrz3PY0";
        $.ajax({
            method : "GET",
            headers : headers,
            url : "https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?version=1&format=json&callback=result",
            async : false,
            data : {
                "coordType" : "WGS84GEO",
                "fullAddr" : fullAddr
            },
            success : function(response) {
                var resultCoordinate = response.coordinateInfo.coordinate[0]; // Get the first coordinate

                if (resultCoordinate.lon.length > 0) {
                    // 구주소
                    lon = resultCoordinate.lon;
                    lat = resultCoordinate.lat;
                } else {
                    // 신주소
                    lon = resultCoordinate.newLon;
                    lat = resultCoordinate.newLat;
                }

                // Trigger a custom event with the lat and lon values
                var event = new CustomEvent('geocodingComplete', { detail: { lat: lat, lon: lon } });
                document.dispatchEvent(event);

                var resultInfo = response.coordinateInfo; // .coordinate[0];
                console.log(resultInfo);
                
                // 기존 마커 삭제
                marker1.setMap(null);
                
                // 3.마커 찍기
                // 검색 결과 정보가 없을 때 처리
                if (resultInfo.coordinate.length == 0) {
                    $("#result").text(
                    "요청 데이터가 올바르지 않습니다.");
                } else {
                    var lon, lat;
                    var resultCoordinate = resultInfo.coordinate[0];
                    if (resultCoordinate.lon.length > 0) {
                        // 구주소
                        lon = resultCoordinate.lon;
                        lat = resultCoordinate.lat;
                    } else { 
                        // 신주소
                        lon = resultCoordinate.newLon;
                        lat = resultCoordinate.newLat
                    }
                
                    var lonEntr, latEntr;
                    
                    if (resultCoordinate.lonEntr == undefined && resultCoordinate.newLonEntr == undefined) {
                        lonEntr = 0;
                        latEntr = 0;
                    } else {
                        if (resultCoordinate.lonEntr.length > 0) {
                            lonEntr = resultCoordinate.lonEntr;
                            latEntr = resultCoordinate.latEntr;
                        } else {
                            lonEntr = resultCoordinate.newLonEntr;
                            latEntr = resultCoordinate.newLatEntr;
                        }
                    }
                        
                    var markerPosition = new Tmapv2.LatLng(Number(lat),Number(lon));
                    
                    // 마커 올리기
                    marker1 = new Tmapv2.Marker(
                        {
                            position : markerPosition,
                            icon : "img/pin_map_google_icon.png",
                            iconSize : new Tmapv2.Size(38, 38),
                            map : map
                        });
                    //지도 중앙에 마커 표시
                    map.setCenter(markerPosition);

                    // 검색 결과 표출
                    var matchFlag, newMatchFlag;
                    // 검색 결과 주소를 담을 변수
                    var address = '', newAddress = '';
                    var city, gu_gun, eup_myun, legalDong, adminDong, ri, bunji;
                    var buildingName, buildingDong, newRoadName, newBuildingIndex, newBuildingName, newBuildingDong;
                    
                    // 새주소일 때 검색 결과 표출 새주소인 경우 matchFlag가 아닌 newMatchFlag가 응답값으로 온다
                    if (resultCoordinate.newMatchFlag.length > 0) {
                        // 새(도로명) 주소 좌표 매칭
                        // 구분 코드
                        newMatchFlag = resultCoordinate.newMatchFlag;
                        
                        // 시/도 명칭
                        if (resultCoordinate.city_do.length > 0) {
                            city = resultCoordinate.city_do;
                            newAddress += city + "\n";
                        }
                        
                        // 군/구 명칭
                        if (resultCoordinate.gu_gun.length > 0) {
                            gu_gun = resultCoordinate.gu_gun;
                            newAddress += gu_gun + "\n";
                        }
                        
                        // 읍면동 명칭
                        if (resultCoordinate.eup_myun.length > 0) {
                            eup_myun = resultCoordinate.eup_myun;
                            newAddress += eup_myun + "\n";
                        } else {
                            // 출력 좌표에 해당하는
                            // 법정동 명칭
                            if (resultCoordinate.legalDong.length > 0) {
                                legalDong = resultCoordinate.legalDong;
                                newAddress += legalDong + "\n";
                            }
                            // 출력 좌표에 해당하는
                            // 행정동 명칭
                            if (resultCoordinate.adminDong.length > 0) {
                                adminDong = resultCoordinate.adminDong;
                                newAddress += adminDong + "\n";
                            }
                        }
                        // 출력 좌표에 해당하는 리 명칭
                        if (resultCoordinate.ri.length > 0) {
                            ri = resultCoordinate.ri;
                            newAddress += ri + "\n";
                        }
                        // 출력 좌표에 해당하는 지번 명칭
                        if (resultCoordinate.bunji.length > 0) {
                            bunji = resultCoordinate.bunji;
                            newAddress += bunji + "\n";
                        }
                        // 새(도로명)주소 매칭을 한
                        // 경우, 길 이름을 반환
                        if (resultCoordinate.newRoadName.length > 0) {
                            newRoadName = resultCoordinate.newRoadName;
                            newAddress += newRoadName + "\n";
                        }
                        // 새(도로명)주소 매칭을 한
                        // 경우, 건물 번호를 반환
                        if (resultCoordinate.newBuildingIndex.length > 0) {
                            newBuildingIndex = resultCoordinate.newBuildingIndex;
                            newAddress += newBuildingIndex + "\n";
                        }
                        // 새(도로명)주소 매칭을 한
                        // 경우, 건물 이름를 반환
                        if (resultCoordinate.newBuildingName.length > 0) {
                            newBuildingName = resultCoordinate.newBuildingName;
                            newAddress += newBuildingName + "\n";
                        }
                        // 새주소 건물을 매칭한 경우
                        // 새주소 건물 동을 반환
                        if (resultCoordinate.newBuildingDong.length > 0) {
                            newBuildingDong = resultCoordinate.newBuildingDong;
                            newAddress += newBuildingDong + "\n";
                        }
                        // 검색 결과 표출
                        if (lonEntr > 0) {
                            var text = "검색결과(새주소) : " + newAddress + "</br> 위경도좌표 : " + lat + ", " + lon;
                            $("#result").html(text);
                        } else {
                            var text = "검색결과(새주소) : " + newAddress + "</br> 위경도좌표(입구점) : 위경도좌표(입구점)이 없습니다.";
                            $("#result").html(text);
                        }
                    }
                    
                    // 구주소일 때 검색 결과 표출 구주소인 경우 newMatchFlag가 아닌 MatchFlag가 응닶값으로 온다
                    if (resultCoordinate.matchFlag.length > 0) {
                        // 매칭 구분 코드
                        matchFlag = resultCoordinate.matchFlag;
                    
                        // 시/도 명칭
                        if (resultCoordinate.city_do.length > 0) {
                            city = resultCoordinate.city_do;
                            address += city + "\n";
                        }
                        // 군/구 명칭
                        if (resultCoordinate.gu_gun.length > 0) {
                            gu_gun = resultCoordinate.gu_gun;
                            address += gu_gun+ "\n";
                        }
                        // 읍면동 명칭
                        if (resultCoordinate.eup_myun.length > 0) {
                            eup_myun = resultCoordinate.eup_myun;
                            address += eup_myun + "\n";
                        }
                        // 출력 좌표에 해당하는 법정동
                        // 명칭
                        if (resultCoordinate.legalDong.length > 0) {
                            legalDong = resultCoordinate.legalDong;
                            address += legalDong + "\n";
                        }
                        // 출력 좌표에 해당하는 행정동
                        // 명칭
                        if (resultCoordinate.adminDong.length > 0) {
                            adminDong = resultCoordinate.adminDong;
                            address += adminDong + "\n";
                        }
                        // 출력 좌표에 해당하는 리 명칭
                        if (resultCoordinate.ri.length > 0) {
                            ri = resultCoordinate.ri;
                            address += ri + "\n";
                        }
                        // 출력 좌표에 해당하는 지번 명칭
                        if (resultCoordinate.bunji.length > 0) {
                            bunji = resultCoordinate.bunji;
                            address += bunji + "\n";
                        }
                        // 출력 좌표에 해당하는 건물 이름
                        // 명칭
                        if (resultCoordinate.buildingName.length > 0) {
                            buildingName = resultCoordinate.buildingName;
                            address += buildingName + "\n";
                        }
                        // 출력 좌표에 해당하는 건물 동을
                        // 명칭
                        if (resultCoordinate.buildingDong.length > 0) {
                            buildingDong = resultCoordinate.buildingDong;
                            address += buildingDong + "\n";
                        }
                        // 검색 결과 표출
                        if (lonEntr > 0) {
                            var text = "검색결과(지번주소) : "+ address+ ","+ "\n"+ "</br>"+ "위경도좌표 : "+ lat + ", "+ lon;
                            $("#result").html(text);
                        } else {
                            var text = "검색결과(지번주소) : "+ address+ ","+ "\n"+ "</br>"+ "위경도좌표(입구점) : 위경도좌표(입구점)이 없습니다.";
                            $("#result").html(text);
                        }
                    }
                }
            },
            error : function(request, status, error) {
                console.log(request);
                console.log("code:"+request.status + "\n message:" + request.responseText +"\n error:" + error);
                // 에러가 발생하면 맵을 초기화함
                // markerStartLayer.clearMarkers();
                // 마커초기화 위치는 살바도르의 집 DMC센트럴
                map.setCenter(new Tmapv2.LatLng(37.574989, 126.896907));
                $("#result").html("");
            
            }
        });
    });

}